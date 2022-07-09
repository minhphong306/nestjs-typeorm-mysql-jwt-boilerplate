import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Trip from './entities/trip.entity';
import TripMember from './entities/tripMember.entity';
import { UsersModule } from '../users/user.module';
import TripFee from './entities/tripFee.entity';
import TripSchedule from './entities/tripSchedule';
import TripScheduleDetail from './entities/tripScheduleDetail';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      TripScheduleDetail,
      TripSchedule,
      TripMember,
      TripFee,
      Trip,
    ]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
