import {
    IsNumber,
    Min,
    IsBoolean,
    ValidateIf,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class FinancialInfoDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0.01, { message: 'Monthly salary must be provided and greater than 0' })
    monthlySalary: number;
  
    @IsBoolean()
    hasAdditionalIncome: boolean;
  
    @ValidateIf(o => o.hasAdditionalIncome === true)
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Additional income cannot be negative' })
    additionalIncome?: number;
  
    @IsBoolean()
    hasMortgage: boolean;
  
    @ValidateIf(o => o.hasMortgage === true)
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Mortgage amount cannot be negative' })
    mortgage?: number;
  
    @IsBoolean()
    hasOtherCredits: boolean;
  
    @ValidateIf(o => o.hasOtherCredits === true)
    @Type(() => Number)
    @IsNumber()
    @Min(0, { message: 'Other credits amount cannot be negative' })
    otherCredits?: number;
  }
  