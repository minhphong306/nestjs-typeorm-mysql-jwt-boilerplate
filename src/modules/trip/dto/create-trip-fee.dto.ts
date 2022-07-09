export class CreateTripFeeDto {
  userId: number;
  name: string;
  memberIds: number[];
  userSpendId: number;
  amount: number;
  date: string;
}

export class UpdateTripFeeDto {
  userId: number;
  name: string;
  memberIds: number[];
  userSpendId: number;
  amount: number;
  date: string;
}
