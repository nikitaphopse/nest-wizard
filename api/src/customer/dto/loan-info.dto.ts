import {
    IsInt,
    Min,
    Max,
    IsNumber,
    Validate,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  @ValidatorConstraint({ name: 'upfrontLessThanAmount', async: false })
  class UpfrontLessThanAmount implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const obj = args.object as any;
      if (typeof obj.upfront !== 'number' || typeof obj.amount !== 'number') return false;
      return obj.upfront < obj.amount;
    }
    defaultMessage(args: ValidationArguments) {
      return 'Upfront payment must be less than loan amount';
    }
  }
  
  export class LoanInfoDto {
    @Type(() => Number)
    @IsInt()
    @Min(10000, { message: 'Loan amount must be at least 10,000' })
    @Max(70000, { message: 'Loan amount must be at most 70,000' })
    amount: number;
  
    @Type(() => Number)
    @IsNumber()
    @Validate(UpfrontLessThanAmount)
    upfront: number;
  
    @Type(() => Number)
    @IsInt()
    @Min(10, { message: 'Terms must be at least 10 months' })
    @Max(30, { message: 'Terms must be at most 30 months' })
    terms: number;
  }
  