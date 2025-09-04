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

  /**
 * Saves the personal information of a customer.
 * 
 * If a `uid` is provided, updates the existing customer's personal info.
 * If no `uid` is provided, creates a new customer with a generated UID.
 * 
 * @param {PersonalInfoDto} dto - The personal information data to save.
 * @param {string} [uid] - Optional UID of the customer to update. If not provided, a new customer will be created.
 * @returns {Promise<Customer>} The created or updated customer object.
 * @throws {NotFoundException} If a `uid` is provided but no existing customer is found with that UID.
 */
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

  /**
 * Updates the contact information of an existing customer.
 * 
 * @param {string} uid - The UID of the customer to update.
 * @param {ContactInfoDto} dto - The contact information data to save.
 * @returns {Promise<Customer>} The updated customer object.
 * @throws {NotFoundException} If no customer is found with the provided UID.
 */
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

  /**
 * Updates the loan information of an existing customer.
 * 
 * @param {string} uid - The UID of the customer to update.
 * @param {LoanInfoDto} dto - The loan information data to save.
 * @returns {Promise<Customer>} The updated customer object.
 * @throws {NotFoundException} If no customer is found with the provided UID.
 */
  async saveFinancialInfo(uid: string, dto: FinancialInfoDto): Promise<Customer> {
    const customer = await this.getCustomerById(uid);
    customer.financialInfo = dto;
    await this.customerRepository.createOrUpdate(customer);
    return customer;
  }

  /**
 * Finalizes a customer's profile by verifying loan and financial information
 * and checking if the loan amount is affordable based on net monthly income.
 * 
 * @param {string} id - The UID of the customer to finalize.
 * @returns {Promise<Customer>} The finalized customer object.
 * @throws {BadRequestException} If the customer is missing loan or financial information.
 * @throws {BadRequestException} If the customer's net monthly income is insufficient for the requested loan amount.
 * @throws {NotFoundException} If no customer is found with the provided UID.
 */
  async finalize(id: string): Promise<Customer> {
    const customer = await this.getCustomerById(id);

    if (!customer.loanInfo || !customer.financialInfo) {
      throw new BadRequestException('Loan and financial information must be provided before finalizing');
    }

    const { amount, terms } = customer.loanInfo;
    const {
      monthlySalary,
      hasAdditionalIncome,
      additionalIncome,
      hasMortgage,
      mortgage,
      hasOtherCredits,
      otherCredits,
    } = customer.financialInfo;

    // Calculate net monthly income
    const additionalIncomeAmount = hasAdditionalIncome ? (additionalIncome || 0) : 0;
    const mortgageAmount = hasMortgage ? (mortgage || 0) : 0;
    const otherCreditsAmount = hasOtherCredits ? (otherCredits || 0) : 0;

    // amortize otherCredits across terms
    const monthlyOtherCredits = terms > 0 ? otherCreditsAmount / terms : 0;

    const netMonthlyIncome = monthlySalary + additionalIncomeAmount - mortgageAmount - monthlyOtherCredits;

    const maxAffordableLoan = netMonthlyIncome * terms * 0.5;

    if (maxAffordableLoan < amount) {
      throw new BadRequestException(
        `Insufficient income. Your net monthly income (€${netMonthlyIncome.toFixed(2)}) is too low for this loan amount. Please reduce the loan amount or restart with a new person.`
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

  /**
 * Retrieves a single customer by their UID.
 * 
 * @param {string} uid - The UID of the customer to retrieve.
 * @returns {Promise<Customer>} The customer object if found.
 * @throws {NotFoundException} If no customer is found with the provided UID.
 */
  async findAll(): Promise<Customer[]> {
    return this.customerRepository.load();
  }

  /**
 * Retrieves a customer by UID from the repository.
 * 
 * This is a private helper method used internally to fetch a customer and
 * ensure they exist before performing updates or other operations.
 * 
 * @param {string} uid - The UID of the customer to retrieve.
 * @returns {Promise<Customer>} The customer object if found.
 * @throws {NotFoundException} If no customer is found with the provided UID.
 * @private
 */
  private async getCustomerById(uid: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(uid);
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }
}
