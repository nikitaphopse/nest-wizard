import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { ContactInfoDto } from './dto/contact-info.dto';
import { LoanInfoDto } from './dto/loan-info.dto';
import { FinancialInfoDto } from './dto/financial-info.dto';
import { Customer } from './customer.types';
import { CustomerRepository } from './customer.repository';
import { calculateAge } from 'src/utils';

@Injectable()
export class CustomerService {

  constructor(private readonly customerRepository: CustomerRepository) { }

  async savePersonalInfo(dto: PersonalInfoDto, uid?: string): Promise<Customer> {
    let customer: Customer;

    if (!uid) {
      // First time → create a new customer
      const newUid = uuid();
      customer = {
        uid: newUid,
        isFinalized: false,
        personalInfo: dto,
      };
    } else {
      // Update existing customer
      const existing = await this.customerRepository.findById(uid);
      if (!existing) {
        throw new NotFoundException(`Customer with id ${uid} not found`);
      }
      customer = { ...existing, personalInfo: dto };
    }

    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }

  async saveContactInfo(uid: string, dto: ContactInfoDto): Promise<Customer> {
    const customer = await this.getCustomerById(uid);
    customer.contactInfo = dto;
    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }

  async saveLoanInfo(uid: string, dto: LoanInfoDto): Promise<Customer> {
    const customer = await this.getCustomerById(uid);
    customer.loanInfo = dto;
    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }

  async saveFinancialInfo(uid: string, dto: FinancialInfoDto): Promise<Customer> {
    const customer = await this.getCustomerById(uid);
    customer.financialInfo = dto;
    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }

  async finalize(id: string): Promise<Customer> {
    const customer = await this.getCustomerById(id);

    if (!customer.loanInfo || !customer.financialInfo) {
      throw new BadRequestException('Loan and financial information must be provided before finalizing');
    }

    const { amount, terms } = customer.loanInfo;
    const {
      monthlySalary,
      additionalIncome = 0,
      mortgage = 0,
      otherCredits = 0,
    } = customer.financialInfo;

    // amortize otherCredits across terms
    const monthlyOtherCredits = terms > 0 ? otherCredits / terms : 0;

    const disposablePerMonth =
      monthlySalary + additionalIncome - mortgage - monthlyOtherCredits;

    const maxAffordableLoan = disposablePerMonth * terms * 0.5;

    if (maxAffordableLoan <= amount) {
      throw new BadRequestException(
        `Loan amount too high. Max affordable loan: ${maxAffordableLoan}. Please reduce loan amount or restart.`
      );
    }

    customer.isFinalized = true;
    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }


  async findOne(uid: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(uid);
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.load();
  }

  private async getCustomerById(uid: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(uid);
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }
}
