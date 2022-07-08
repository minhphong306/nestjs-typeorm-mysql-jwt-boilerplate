import { IsNotEmpty, IsString } from 'class-validator';
import { BankInfo } from './bank-info';
import User from '../entities/users.entity';

export class UpdateUserInfoBody {
  user: User;
  updatedFields: Record<string, boolean>;
}
