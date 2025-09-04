import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { ContactInfoDto } from './dto/contact-info.dto';
import { LoanInfoDto } from './dto/loan-info.dto';
import { FinancialInfoDto } from './dto/financial-info.dto';
import { Customer } from './customer.types';
import { mock, instance, when, verify, anything, resetCalls } from 'ts-mockito';

describe('CustomerService (ts-mockito)', () => {
  let service: CustomerService;
  let mockRepo: CustomerRepository;

  beforeEach(async () => {
    mockRepo = mock(CustomerRepository);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useFactory: () => instance(mockRepo) },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    resetCalls(mockRepo);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('savePersonalInfo', () => {
    it('creates a new customer when uid not provided', async () => {
      const dto: PersonalInfoDto = { firstName: 'Test', lastName: 'User', birthDate: '1990-01-01' } as any;

      const result = await service.savePersonalInfo(dto);

      expect(result.uid).toBeDefined();
      expect(result.personalInfo).toEqual(dto);
      verify(mockRepo.createOrUpdate(anything())).once();
    });

    it('updates existing customer when uid is provided', async () => {
      const uid = '123';
      const existing: Customer = { uid, isFinalized: false, personalInfo: {} as any };
      when(mockRepo.findById(uid)).thenResolve(existing);

      const dto: PersonalInfoDto = { firstName: 'Test', lastName: 'User', birthDate: '1995-01-01' } as any;
      await service.savePersonalInfo(dto, uid);

      verify(mockRepo.createOrUpdate(anything())).once();
    });

    it('throws NotFoundException when updating non-existing customer', async () => {
      when(mockRepo.findById('missing')).thenResolve(null);

      await expect(service.savePersonalInfo({} as any, 'missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('saveContactInfo', () => {
    it('updates contact info', async () => {
      const uid = '123';
      const existing: Customer = { uid, isFinalized: false, personalInfo: {} as any };
      when(mockRepo.findById(uid)).thenResolve(existing);

      const dto: ContactInfoDto = { email: 'test.user@nkd.in', phone: '123' } as any;
      const result = await service.saveContactInfo(uid, dto);

      expect(result.contactInfo).toEqual(dto);
      verify(mockRepo.createOrUpdate(anything())).once();
    });
  });

  describe('saveLoanInfo', () => {
    it('updates loan info', async () => {
      const uid = '123';
      const existing: Customer = { uid, isFinalized: false, personalInfo: {} as any };
      when(mockRepo.findById(uid)).thenResolve(existing);

      const dto: LoanInfoDto = { amount: 1000, terms: 12 } as any;
      const result = await service.saveLoanInfo(uid, dto);

      expect(result.loanInfo).toEqual(dto);
      verify(mockRepo.createOrUpdate(anything())).once();
    });
  });

  describe('saveFinancialInfo', () => {
    it('updates financial info', async () => {
      const uid = '123';
      const existing: Customer = { uid, isFinalized: false, personalInfo: {} as any };
      when(mockRepo.findById(uid)).thenResolve(existing);

      const dto: FinancialInfoDto = { monthlySalary: 2000 } as any;
      const result = await service.saveFinancialInfo(uid, dto);

      expect(result.financialInfo).toEqual(dto);
      verify(mockRepo.createOrUpdate(anything())).once();
    });
  });

  describe('finalize', () => {
    it('throws if loanInfo or financialInfo is missing', async () => {
      const uid = '123';
      const customer: Customer = { uid, isFinalized: false, personalInfo: {} as any };
      when(mockRepo.findById(uid)).thenResolve(customer);

      await expect(service.finalize(uid)).rejects.toThrow(BadRequestException);
    });

    it('throws if income is insufficient', async () => {
      const uid = '123';
      const customer: Customer = {
        uid,
        isFinalized: false,
        personalInfo: {} as any,
        loanInfo: { amount: 10000, terms: 10 } as any,
        financialInfo: {
          monthlySalary: 100,
          hasAdditionalIncome: false,
          hasMortgage: false,
          hasOtherCredits: false,
        } as any,
      };
      when(mockRepo.findById(uid)).thenResolve(customer);

      await expect(service.finalize(uid)).rejects.toThrow(BadRequestException);
    });

    it('finalizes successfully if income is sufficient', async () => {
      const uid = '123';
      const customer: Customer = {
        uid,
        isFinalized: false,
        personalInfo: {} as any,
        loanInfo: { amount: 1000, terms: 12 } as any,
        financialInfo: {
          monthlySalary: 2000,
          hasAdditionalIncome: false,
          hasMortgage: false,
          hasOtherCredits: false,
        } as any,
      };
      when(mockRepo.findById(uid)).thenResolve(customer);

      const result = await service.finalize(uid);

      expect(result.isFinalized).toBe(true);
      verify(mockRepo.createOrUpdate(anything())).once();
    });
  });

  describe('findOne', () => {
    it('returns customer if found', async () => {
      const customer = { uid: '1', isFinalized: false } as any;
      when(mockRepo.findById('1')).thenResolve(customer);

      const result = await service.findOne('1');
      expect(result).toEqual(customer);
    });

    it('throws if customer not found', async () => {
      when(mockRepo.findById('x')).thenResolve(null);

      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('returns all customers', async () => {
      const customers = [{ uid: '1' }, { uid: '2' }] as any;
      when(mockRepo.load()).thenResolve(customers);

      const result = await service.findAll();
      expect(result).toEqual(customers);
    });
  });
});
