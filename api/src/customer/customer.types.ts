import { ContactInfoDto } from "./dto/contact-info.dto";
import { FinancialInfoDto } from "./dto/financial-info.dto";
import { LoanInfoDto } from "./dto/loan-info.dto";
import { PersonalInfoDto } from "./dto/personal-info.dto";

export interface Customer {
  uid: string;
  personalInfo?: PersonalInfoDto;
  contactInfo?: ContactInfoDto;
  loanInfo?: LoanInfoDto;
  financialInfo?: FinancialInfoDto;
  isFinalized: boolean;
}