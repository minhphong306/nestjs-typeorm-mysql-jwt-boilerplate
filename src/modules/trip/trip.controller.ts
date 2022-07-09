import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import TripResponse from './dto/trip-response';
import TripSchedule from './entities/tripSchedule';
import { CreateTripSchedule } from './dto/create-schedule.dto';
import { HttpResponse } from '../../types/http-response';
import { UpdateTripScheduleDto } from './dto/update-trip-schedule.dto';
import TripScheduleDetail from './entities/tripScheduleDetail';
import { CreateTripScheduleDetailDto } from './dto/create-trip-schedule-detail.dto';
import { UpdateTripScheduleDetailDto } from './dto/update-trip-schedule-detail.dto';
import { CreateTripMemberDto } from './dto/create-trip-member.dto';
import TripMember from './entities/tripMember.entity';
import { TripMemberResponseDto } from './dto/trip-member-response.dto';
import { UpdateTripMemberDto } from './dto/update-trip-member';
import { CreateTripFeeDto, UpdateTripFeeDto } from './dto/create-trip-fee.dto';
import TripFee from './entities/tripFee.entity';
import Trip from './entities/trip.entity';

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
  ): Promise<HttpResponse> {
    this.logger.debug('Got request delete trip schedule, body');
    const res = await this.tripService.deleteSchedule(+scheduleId);
    return {
      success: res,
    };
  }

  @Post(':tripId/schedule/:scheduleId')
  async updateTripSchedule(
    @Param('scheduleId', new ParseIntPipe()) scheduleId,
    @Body() body: UpdateTripScheduleDto,
  ): Promise<HttpResponse> {
    this.logger.debug(
      'Got request create trip schedule, body: ',
      JSON.stringify(body),
    );
    const res = await this.tripService.updateSchedule(+scheduleId, body);
    return {
      success: res,
    };
  }

  @Get(':tripId/:scheduleId/details')
  async getScheduleDetail(
    @Param('scheduleId', new ParseIntPipe()) scheduleId,
  ): Promise<TripScheduleDetail[]> {
    this.logger.debug(`Got request get schedule detail ${scheduleId}`);
    const res = await this.tripService.getScheduleDetail(+scheduleId);
    return res;
  }

  @Post(':tripId/:scheduleId/details')
  async createScheduleDetail(
    @Param('scheduleId', new ParseIntPipe()) scheduleId,
    @Body() body: CreateTripScheduleDetailDto,
  ): Promise<TripScheduleDetail> {
    this.logger.debug(
      'Got request create trip schedule detail, body: ',
      JSON.stringify(body),
    );
    const res = await this.tripService.createScheduleDetail(+scheduleId, body);
    return res;
  }

  @Post(':tripId/:scheduleId/details/:detailId')
  async updateScheduleDetail(
    @Param('detailId', new ParseIntPipe()) detailId,
    @Body() body: UpdateTripScheduleDetailDto,
  ): Promise<HttpResponse> {
    this.logger.debug(
      'Got request update trip schedule detail, body: ',
      JSON.stringify(body),
    );
    const res = await this.tripService.updateScheduleDetail(+detailId, body);
    return {
      success: res,
    };
  }

  @Delete(':tripId/:scheduleId/details/:detailId')
  async deleteTripScheduleDetail(
    @Param('detailId', new ParseIntPipe()) detailId,
  ): Promise<HttpResponse> {
    this.logger.debug('Got request delete trip schedule, body');
    const res = await this.tripService.deleteScheduleDetail(+detailId);
    return {
      success: res,
    };
  }

  @Post(':tripId/members')
  async createTripMember(
    @Param('tripId', new ParseIntPipe()) tripId,
    @Body() body: CreateTripMemberDto,
  ): Promise<TripMember> {
    this.logger.debug('Got create trip member, body: ', JSON.stringify(body));

    return await this.tripService.createTripMember(+tripId, body);
  }

  @Get(':tripId/members')
  async getTripMember(
    @Param('tripId', new ParseIntPipe()) tripId,
  ): Promise<TripMemberResponseDto[]> {
    this.logger.debug('Got request get trip member');

    return await this.tripService.getTripMembers(+tripId);
  }

  @Post(':tripId/members/:memberId')
  async updateTripMember(
    @Param('memberId', new ParseIntPipe()) memberId,
    @Body() body: UpdateTripMemberDto,
  ): Promise<HttpResponse> {
    this.logger.debug('Got request get trip member');

    const result = await this.tripService.updateTripMember(+memberId, body);
    return {
      success: result,
    };
  }

  @Delete(':tripId/members/:memberId')
  async deleteTripMember(
    @Param('memberId', new ParseIntPipe()) memberId,
  ): Promise<HttpResponse> {
    this.logger.debug('Got request delete trip schedule, body');
    const res = await this.tripService.deleteTripMember(+memberId);
    return {
      success: res,
    };
  }

  // Fee API
  @Post(':tripId/fee')
  async createTripFee(
    @Param('tripId', new ParseIntPipe()) tripId,
    @Body() body: CreateTripFeeDto,
  ): Promise<TripFee> {
    this.logger.debug('Got create trip fee, body: ', JSON.stringify(body));

    return await this.tripService.createTripFee(+tripId, body);
  }

  @Post(':tripId/fee/:tripFeeId')
  async updateTripFee(
    @Param('tripFeeId', new ParseIntPipe()) tripFeeId,
    @Body() body: UpdateTripFeeDto,
  ): Promise<HttpResponse> {
    this.logger.debug('Got update trip fee: ', JSON.stringify(body));

    const result = await this.tripService.updateTripFee(+tripFeeId, body);
    return {
      success: result,
    };
  }

  @Get(':tripId/fee')
  async getTripFee(
    @Param('tripId', new ParseIntPipe()) tripId,
  ): Promise<TripFee[]> {
    this.logger.debug('Got get trip fee request: ', tripId);

    return await this.tripService.getTripFee(+tripId);
  }
}
