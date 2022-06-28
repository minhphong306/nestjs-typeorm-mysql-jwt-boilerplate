import { BankInfo } from './bank-info';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInfoBody {
  @IsNotEmpty()
  @IsString()
  name: string;

  bankInfo: BankInfo;
}
