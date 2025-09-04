import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { ContactInfoDto } from './dto/contact-info.dto';
import { LoanInfoDto } from './dto/loan-info.dto';
import { FinancialInfoDto } from './dto/financial-info.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  /**
   * Creates a new customer or updates personal information for an existing customer.
   * 
   * @param {PersonalInfoDto} dto - The personal information from the request body.
   * @param {string} [uid] - Optional UID of the customer to update (from query parameter).
   * @returns {Promise<Customer>} The created or updated customer object.
   * @throws {NotFoundException} If a UID is provided but no customer is found.
   */
  @Post('personal-info')
  async savePersonal(
    @Body() dto: PersonalInfoDto,
    @Query('uid') uid?: string,
  ) {
    return this.customerService.savePersonalInfo(dto, uid);
  }

  /**
   * Updates the contact information of an existing customer.
   * 
   * @param {string} uid - The UID of the customer to update.
   * @param {ContactInfoDto} dto - The contact information data from the request body.
   * @returns {Promise<Customer>} The updated customer object.
   * @throws {NotFoundException} If the customer is not found.
   */
  @Patch(':uid/contact-info')
  async saveContact(
    @Param('uid') uid: string,
    @Body() dto: ContactInfoDto,
  ) {
    return this.customerService.saveContactInfo(uid, dto);
  }

  /**
   * Updates the loan information of an existing customer.
   * 
   * @param {string} uid - The UID of the customer to update.
   * @param {LoanInfoDto} dto - The loan information data from the request body.
   * @returns {Promise<Customer>} The updated customer object.
   * @throws {NotFoundException} If the customer is not found.
   */
  @Patch(':uid/loan-info')
  async saveLoan(
    @Param('uid') uid: string,
    @Body() dto: LoanInfoDto,
  ) {
    return this.customerService.saveLoanInfo(uid, dto);
  }

  /**
   * Updates the financial information of an existing customer.
   * 
   * @param {string} uid - The UID of the customer to update.
   * @param {FinancialInfoDto} dto - The financial information data from the request body.
   * @returns {Promise<Customer>} The updated customer object.
   * @throws {NotFoundException} If the customer is not found.
   */
  @Patch(':uid/financial-info')
  async saveFinancial(
    @Param('uid') uid: string,
    @Body() dto: FinancialInfoDto,
  ) {
    return this.customerService.saveFinancialInfo(uid, dto);
  }

  /**
   * Finalizes a customer's profile after validating loan and financial info.
   * 
   * @param {string} uid - The UID of the customer to finalize.
   * @returns {Promise<Customer>} The finalized customer object.
   * @throws {BadRequestException} If loan or financial info is missing or loan is unaffordable.
   * @throws {NotFoundException} If the customer is not found.
   */
  @Patch(':uid/finalize')
  async finalize(@Param('uid') uid: string) {
    return this.customerService.finalize(uid);
  }

  /**
   * Retrieves a single customer by UID.
   * 
   * @param {string} uid - The UID of the customer to retrieve.
   * @returns {Promise<Customer>} The customer object if found.
   * @throws {NotFoundException} If the customer is not found.
   */
  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return this.customerService.findOne(uid);
  }

  /**
   * Retrieves all customers.
   * 
   * @returns {Promise<Customer[]>} An array of all customer objects.
   */
  @Get()
  async findAll() {
    return this.customerService.findAll();
  }
}
