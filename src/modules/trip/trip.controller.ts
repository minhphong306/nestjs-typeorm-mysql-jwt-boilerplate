import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import TripResponse from './dto/trip-response';
import TripSchedule from './entities/tripSchedule';
import { CreateTripSchedule } from './dto/create-schedule.dto';
import { HttpResponse } from '../../types/http-response';

@Controller('trip')
export class TripController {
  private readonly logger = new Logger(TripController.name);
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    this.logger.log('Got update request: ', JSON.stringify(updateTripDto));
    return this.tripService.update(+id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }

  @Get('userTrip/:userId')
  async getMyTrips(
    @Param('userId', new ParseIntPipe()) userId,
  ): Promise<TripResponse[]> {
    return await this.tripService.getMyTrip(+userId);
  }

  @Get(':tripId/schedule')
  async getSchedules(
    @Param('tripId', new ParseIntPipe()) tripId,
  ): Promise<TripSchedule[]> {
    return await this.tripService.getScheduleList(+tripId);
  }

  @Post(':tripId/schedule')
  async createTripSchedule(
    @Param('tripId', new ParseIntPipe()) tripId,
    @Body() body: CreateTripSchedule,
  ): Promise<TripSchedule> {
    this.logger.debug(
      'Got request create trip schedule, body: ',
      JSON.stringify(body),
    );
    return await this.tripService.createSchedule(+tripId, body);
  }

  @Delete(':tripId/schedule/:scheduleId')
  async deleteTripSchedule(
    @Param('scheduleId', new ParseIntPipe()) scheduleId,
    @Body() body: CreateTripSchedule,
  ): Promise<HttpResponse> {
    this.logger.debug(
      'Got request create trip schedule, body: ',
      JSON.stringify(body),
    );
    const res = await this.tripService.deleteSchedule(+scheduleId);
    return {
      success: res,
    };
  }
}
