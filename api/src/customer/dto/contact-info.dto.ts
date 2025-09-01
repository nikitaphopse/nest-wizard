import { IsEmail, IsString, Matches } from 'class-validator';
import { E164_REGEX } from '../../utils';

export class ContactInfoDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @Matches(E164_REGEX, { message: 'Phone must be in E.164 format (e.g. +1234567890)' })
  phone: string;
}
