import {
  IsString,
  Matches,
  IsDateString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';
import { NAME_TOKEN_REGEX, LAST_NAME_REGEX, calculateAge } from '../../utils';

@ValidatorConstraint({ name: 'MaxAge', async: false })
class MaxAgeValidator implements ValidatorConstraintInterface {
  validate(dateOfBirth: string, args: ValidationArguments) {
    if (!dateOfBirth) return false;
    const age = calculateAge(new Date(dateOfBirth));
    return age <= 79;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Age must be less than 80 years old';
  }
}

export class PersonalInfoDto {
  @IsString()
  @Matches(NAME_TOKEN_REGEX, {
    message: 'First name must contain only Latin/German letters and be a single name',
  })
  firstName: string;

  @IsString()
  @Matches(LAST_NAME_REGEX, {
    message:
      'Last name must contain only Latin/German letters, may include spaces or hyphens',
  })
  lastName: string;

  @IsDateString({}, { message: 'dateOfBirth must be an ISO date string' })
  @Validate(MaxAgeValidator)
  dateOfBirth: string;
}

