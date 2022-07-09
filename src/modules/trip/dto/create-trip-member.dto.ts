import { TripMemberStatus } from '../enum/status';

export class CreateTripMemberDto {
  userId: number;
  status: TripMemberStatus;
}
