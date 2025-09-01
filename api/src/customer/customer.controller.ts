import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { PersonalInfoDto } from './dto/personal-info.dto';
import { ContactInfoDto } from './dto/contact-info.dto';
import { LoanInfoDto } from './dto/loan-info.dto';
import { FinancialInfoDto } from './dto/financial-info.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('personal-info')
  async savePersonal(
    @Body() dto: PersonalInfoDto,
    @Query('uid') uid?: string,
  ) {
    return this.customerService.savePersonalInfo(dto, uid);
  }

  @Patch(':uid/contact-info')
  async saveContact(
    @Param('uid') uid: string,
    @Body() dto: ContactInfoDto,
  ) {
    return this.customerService.saveContactInfo(uid, dto);
  }

  @Patch(':uid/loan-info')
  async saveLoan(
    @Param('uid') uid: string,
    @Body() dto: LoanInfoDto,
  ) {
    return this.customerService.saveLoanInfo(uid, dto);
  }

  @Patch(':uid/financial-info')
  async saveFinancial(
    @Param('uid') uid: string,
    @Body() dto: FinancialInfoDto,
  ) {
    return this.customerService.saveFinancialInfo(uid, dto);
  }

  @Patch(':uid/finalize')
  async finalize(@Param('uid') uid: string) {
    return this.customerService.finalize(uid);
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string) {
    return this.customerService.findOne(uid);
  }

  @Get()
  async findAll() {
    return this.customerService.findAll();
  }
}
