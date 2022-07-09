import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Users from '../users/entities/users.entity';
import Trip from '../trip/entities/trip.entity';
import TripMember from '../trip/entities/tripMember.entity';
import TripFee from '../trip/entities/tripFee.entity';
import TripSchedule from '../trip/entities/tripSchedule';
import TripScheduleDetail from '../trip/entities/tripScheduleDetail';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DB'),
        entities: [
          Users,
          Trip,
          TripMember,
          TripFee,
          TripSchedule,
          TripScheduleDetail,
        ],
        synchronize: true,
        logging: configService.get('QUERY_LOG_ENABLE')
          ? ['query', 'error']
          : [],
      }),
    }),
  ],
})
export class DatabaseModule {}
