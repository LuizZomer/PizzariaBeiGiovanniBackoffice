import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceDTO } from './create-payable-account.dto';

export class UpdateFinanceDTO extends PartialType(CreateFinanceDTO) {}
