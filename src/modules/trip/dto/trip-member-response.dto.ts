import { TripMemberStatus } from '../enum/status';

export class TripMemberResponseDto {
  id: number;
  userId: number;
  name: string;
  location: string;
  age: number;
  favorites: string[];
  description: string;
  status: TripMemberStatus;
}
