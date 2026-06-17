import { IsEnum, IsString } from 'class-validator';
import { ContactType } from 'src/enums/contactType.enum';

export class CreateContactDto {
  @IsEnum(ContactType)
  type: ContactType;

  @IsString()
  value: string;

  @IsString()
  customerId: string;
}
