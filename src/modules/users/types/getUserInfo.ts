import { IsNotEmpty, IsString } from 'class-validator';
import { BankInfo } from './bank-info';

export class GetUserInfoBody {
  id: number;
  name: string;
  email: string;
  phone: string;
}
