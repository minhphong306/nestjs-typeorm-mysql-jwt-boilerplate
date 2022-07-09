import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';
import User from '../../users/entities/users.entity';
import Trip from '../entities/trip.entity';

export class UpdateTripDto {
  trip: Trip;
  updatedFields: Record<string, boolean>;
}
