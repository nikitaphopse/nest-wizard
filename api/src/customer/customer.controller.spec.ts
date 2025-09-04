import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './customer.types';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { ContactInfoDto } from './dto/contact-info.dto';
import { LoanInfoDto } from './dto/loan-info.dto';
import { FinancialInfoDto } from './dto/financial-info.dto';
import { mock, instance, when, verify, anyString, anything } from 'ts-mockito';

describe('CustomerController', () => {
  let controller: CustomerController;
  let customerService: CustomerService;
  let mockedCustomerService: CustomerService;

  const mockCustomer: Customer = {
    uid: 'test-uid-123',
    isFinalized: false,
    personalInfo: {
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1992-25-11',
    },
  };

  const mockPersonalInfoDto: PersonalInfoDto = {
    firstName: 'Test',
    lastName: 'User',
    dateOfBirth: '1992-25-11',
  };

  const mockContactInfoDto: ContactInfoDto = {
    email: 'test.user@nkd.in',
    phone: '+1234567890',
  };

  const mockLoanInfoDto: LoanInfoDto = {
    amount: 25000,
    upfront: 5000,
    terms: 24,
  };

  const mockFinancialInfoDto: FinancialInfoDto = {
    monthlySalary: 3000,
    hasAdditionalIncome: false,
    hasMortgage: false,
    hasOtherCredits: false,
  };

  beforeEach(async () => {
    mockedCustomerService = mock(CustomerService);
    customerService = instance(mockedCustomerService);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: customerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('savePersonal', () => {
    it('should save personal info for new customer', async () => {
      when(mockedCustomerService.savePersonalInfo(mockPersonalInfoDto, undefined))
        .thenResolve(mockCustomer);

      const result = await controller.savePersonal(mockPersonalInfoDto);

      expect(result).toEqual(mockCustomer);
      verify(mockedCustomerService.savePersonalInfo(mockPersonalInfoDto, undefined)).once();
    });

    it('should save personal info for existing customer', async () => {
      const uid = 'existing-uid';
      when(mockedCustomerService.savePersonalInfo(mockPersonalInfoDto, uid))
        .thenResolve({ ...mockCustomer, uid });

      const result = await controller.savePersonal(mockPersonalInfoDto, uid);

      expect(result).toEqual({ ...mockCustomer, uid });
      verify(mockedCustomerService.savePersonalInfo(mockPersonalInfoDto, uid)).once();
    });
  });

  describe('saveContact', () => {
    it('should save contact info', async () => {
      const uid = 'test-uid';
      const updatedCustomer = { ...mockCustomer, contactInfo: mockContactInfoDto };
      when(mockedCustomerService.saveContactInfo(uid, mockContactInfoDto))
        .thenResolve(updatedCustomer);

      const result = await controller.saveContact(uid, mockContactInfoDto);

      expect(result).toEqual(updatedCustomer);
      verify(mockedCustomerService.saveContactInfo(uid, mockContactInfoDto)).once();
    });
  });

  describe('saveLoan', () => {
    it('should save loan info', async () => {
      const uid = 'test-uid';
      const updatedCustomer = { ...mockCustomer, loanInfo: mockLoanInfoDto };
      when(mockedCustomerService.saveLoanInfo(uid, mockLoanInfoDto))
        .thenResolve(updatedCustomer);

      const result = await controller.saveLoan(uid, mockLoanInfoDto);

      expect(result).toEqual(updatedCustomer);
      verify(mockedCustomerService.saveLoanInfo(uid, mockLoanInfoDto)).once();
    });
  });

  describe('saveFinancial', () => {
    it('should save financial info', async () => {
      const uid = 'test-uid';
      const updatedCustomer = { ...mockCustomer, financialInfo: mockFinancialInfoDto };
      when(mockedCustomerService.saveFinancialInfo(uid, mockFinancialInfoDto))
        .thenResolve(updatedCustomer);

      const result = await controller.saveFinancial(uid, mockFinancialInfoDto);

      expect(result).toEqual(updatedCustomer);
      verify(mockedCustomerService.saveFinancialInfo(uid, mockFinancialInfoDto)).once();
    });
  });

  describe('finalize', () => {
    it('should finalize customer application', async () => {
      const uid = 'test-uid';
      const finalizedCustomer = { ...mockCustomer, isFinalized: true };
      when(mockedCustomerService.finalize(uid))
        .thenResolve(finalizedCustomer);

      const result = await controller.finalize(uid);

      expect(result).toEqual(finalizedCustomer);
      verify(mockedCustomerService.finalize(uid)).once();
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const uid = 'test-uid';
      when(mockedCustomerService.findOne(uid))
        .thenResolve(mockCustomer);

      const result = await controller.findOne(uid);

      expect(result).toEqual(mockCustomer);
      verify(mockedCustomerService.findOne(uid)).once();
    });
  });

  describe('findAll', () => {
    it('should return all customers', async () => {
      const customers = [mockCustomer];
      when(mockedCustomerService.findAll())
        .thenResolve(customers);

      const result = await controller.findAll();

      expect(result).toEqual(customers);
      verify(mockedCustomerService.findAll()).once();
    });
  });

  describe('error handling', () => {
    it('should handle service errors', async () => {
      const error = new Error('Service error');
      when(mockedCustomerService.savePersonalInfo(anything(), anything()))
        .thenReject(error);

      await expect(controller.savePersonal(mockPersonalInfoDto)).rejects.toThrow('Service error');
    });
  });
});
