import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import Trip from './entities/trip.entity';
import TripResponse from './dto/trip-response';
import TripMember from './entities/tripMember.entity';
import { Status, TripMemberStatus } from './enum/status';
import { UsersService } from '../users/user.service';
import User from '../users/entities/users.entity';
import { getImageUrlFromJsonArray } from '../../utils/json';
import { diffYear, getDateFromDMYString } from '../../utils/date';
import TripSchedule from './entities/tripSchedule';
import TripScheduleDetail from './entities/tripScheduleDetail';
import { CreateTripSchedule } from './dto/create-schedule.dto';
import { UpdateTripScheduleDto } from './dto/update-trip-schedule.dto';
import { CreateTripScheduleDetailDto } from './dto/create-trip-schedule-detail.dto';
import { UpdateTripScheduleDetailDto } from './dto/update-trip-schedule-detail.dto';
import { CreateTripMemberDto } from './dto/create-trip-member.dto';
import { TripMemberResponseDto } from './dto/trip-member-response.dto';
import { UpdateTripMemberDto } from './dto/update-trip-member';
import { CreateTripFeeDto, UpdateTripFeeDto } from './dto/create-trip-fee.dto';
import TripFee from './entities/tripFee.entity';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(TripSchedule)
    private tripScheduleRepository: Repository<TripSchedule>,
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private tripMemberRepository: Repository<TripMember>,
    @InjectRepository(TripScheduleDetail)
    private tripScheduleDetailRepository: Repository<TripScheduleDetail>,
    @InjectRepository(TripFee)
    private tripFeeRepository: Repository<TripFee>,
  ) {}

  async create(dto: CreateTripDto): Promise<Trip> {
    const trip: Trip = {
      budgetFrom: dto.budgetFrom,
      budgetTo: dto.budgetTo,
      categoryType: dto.categoryType,
      description: dto.description,
      featureImages: JSON.stringify(dto.featureImages),
      from: getDateFromDMYString(dto.fromTime),
      language: dto.language,
      name: dto.name,
      status: Status.Draft,
      to: getDateFromDMYString(dto.toTime),
      transportTypes: '',
      userId: dto.userId,
    };

    const newUser = await this.tripRepository.create(trip);
    await this.tripRepository.save(newUser);
    return newUser;
  }

  findAll() {
    return `This action returns all trip`;
  }

  async findOne(id: number): Promise<TripResponse> {
    // Get my trip
    const trip = await this.tripRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!trip) {
      this.logger.debug(`Not found trip with id: ${id}`);
      throw new HttpException('Not found trip', HttpStatus.NOT_FOUND);
    }

    const user = await this.usersService.getUserInfo(trip.userId, null);

    // Count member
    const count = await this.tripMemberRepository.count({
      where: {
        tripId: trip.id,
      },
    });

    return {
      budgetFrom: trip.budgetFrom,
      budgetTo: trip.budgetTo,
      categoryType: trip.categoryType,
      description: trip.description,
      featureImages: getImageUrlFromJsonArray(trip.featureImages),
      from: trip.from,
      host: { age: diffYear(new Date(), user.birthDate), name: user.name },
      id: trip.id,
      language: trip.language,
      localGuideCount: 999,
      memberCount: count,
      name: trip.name,
      status: trip.status,
      to: trip.to,
      transportTypes: trip.transportTypes,
      userId: trip.userId,
    };
  }

  async update(id: number, body: UpdateTripDto) {
    const trip = await this.tripRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!trip) {
      this.logger.error(`Trip with id ${id} does not exist`);
      throw new HttpException(
        'Trip with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const partialEntity = {};

    this.logger.debug('body.updatedFields: ', body.updatedFields);

    if (body.updatedFields['name']) {
      partialEntity['name'] = body.trip.name;
    }

    if (body.updatedFields['description']) {
      partialEntity['description'] = body.trip.description;
    }

    if (body.updatedFields['featureImages']) {
      partialEntity['featureImages'] = JSON.stringify(body.trip.featureImages);
    }

    if (body.updatedFields['from']) {
      partialEntity['from'] = body.trip.from;
    }

    if (body.updatedFields['to']) {
      partialEntity['to'] = body.trip.to;
    }

    if (body.updatedFields['status']) {
      partialEntity['status'] = body.trip.status;
    }

    if (body.updatedFields['budgetFrom']) {
      partialEntity['budgetFrom'] = body.trip.budgetFrom;
    }

    if (body.updatedFields['budgetTo']) {
      partialEntity['budgetTo'] = body.trip.budgetTo;
    }

    if (body.updatedFields['language']) {
      partialEntity['language'] = body.trip.language;
    }

    console.log('Partial entity: ', partialEntity);

    const updateResult = await this.tripRepository.update(
      {
        id: id,
      },
      partialEntity,
    );

    this.logger.debug(
      `Got result after update (${JSON.stringify(
        partialEntity,
      )}): ${JSON.stringify(updateResult)}`,
    );

    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} trip`;
  }

  async getMyTrip(userId: number): Promise<TripResponse[]> {
    const resp: TripResponse[] = [];

    // Get my trip
    const myTrips = await this.tripRepository.find({
      where: {
        userId: userId,
      },
    });

    if (!myTrips) {
      this.logger.debug(`Not found any trip belong to user ${userId}`);
    }

    // Get trip i'm in
    const availableTripStatus: TripMemberStatus[] = [
      TripMemberStatus.Invited,
      TripMemberStatus.Requested,
      TripMemberStatus.Approved,
    ];

    const myJoinTrip = await this.tripMemberRepository.find({
      where: {
        userId: userId,
        status: In(availableTripStatus),
      },
    });

    if (myTrips.length === 0 && myJoinTrip.length === 0) {
      this.logger.log('Empty trip');
      return resp;
    }

    const otherTripIds = [];
    for (const trip of myJoinTrip) {
      otherTripIds.push(trip.tripId);
    }

    // Get other trip
    let otherTrips: Trip[] = [];
    if (otherTripIds.length > 0) {
      otherTrips = await this.tripRepository.find({
        where: {
          id: In(otherTripIds),
        },
      });
    }

    const userIds = [];
    const myTripIds = [];
    for (const trip of myTrips) {
      userIds.push(trip.userId);
      myTripIds.push(trip.id);
    }

    for (const trip of otherTrips) {
      userIds.push(trip.userId);
    }

    // Get owner info
    userIds.push(userId);
    let owners: User[];
    if (userIds.length > 0) {
      owners = await this.usersService.getUserByIds(userIds);
    }

    const mapOwnerIdToObj: Record<number, User> = {};

    for (const owner of owners) {
      mapOwnerIdToObj[owner.id] = owner;
    }

    // Count member
    const mapCount: Record<number, number> = {};
    // TODO: count in single query to avoid N+1 problem
    const tripIds = [...myTripIds, ...otherTripIds];

    for (const tripId of tripIds) {
      mapCount[tripId] = await this.tripMemberRepository.count({
        where: {
          tripId: tripId,
        },
      });
    }

    // TODO: Count local guide

    // Map response
    for (const trip of myTrips) {
      const host = mapOwnerIdToObj[trip.userId];

      const respItem: TripResponse = {
        budgetFrom: trip.budgetFrom,
        budgetTo: trip.budgetTo,
        categoryType: trip.categoryType,
        description: trip.description,
        featureImages: getImageUrlFromJsonArray(trip.featureImages),
        from: trip.from,
        host: { age: diffYear(new Date(), host.birthDate), name: host.name },
        id: trip.id,
        language: trip.language,
        localGuideCount: 999,
        memberCount: mapCount[trip.id],
        name: trip.name,
        status: trip.status,
        to: trip.to,
        transportTypes: trip.transportTypes,
        userId: trip.userId,
      };

      resp.push(respItem);
    }

    return resp;
  }

  async getScheduleList(tripId: number): Promise<TripSchedule[]> {
    return await this.tripScheduleRepository.find({
      where: {
        tripId: tripId,
      },
    });
  }

  async createSchedule(
    tripId: number,
    dto: CreateTripSchedule,
  ): Promise<TripSchedule> {
    const tripSchedule: TripSchedule = {
      name: dto.name,
      tripId: tripId,
      date: getDateFromDMYString(dto.date),
    };

    const newSchedule = await this.tripScheduleRepository.create(tripSchedule);
    await this.tripScheduleRepository.save(newSchedule);
    return newSchedule;
  }

  async deleteSchedule(scheduleId: number): Promise<boolean> {
    const deleteResult = await this.tripScheduleRepository.delete({
      id: scheduleId,
    });

    this.logger.debug(
      `Got delete schedule result: ${JSON.stringify(deleteResult)}`,
    );

    return true;
  }

  async updateSchedule(
    scheduleId: number,
    dto: UpdateTripScheduleDto,
  ): Promise<boolean> {
    const updateResult = await this.tripScheduleRepository.update(
      {
        id: scheduleId,
      },
      dto,
    );

    this.logger.debug(
      `Got update schedule result: ${JSON.stringify(updateResult)}`,
    );

    return true;
  }

  async getScheduleDetail(scheduleId: number): Promise<TripScheduleDetail[]> {
    const scheduleDetails = await this.tripScheduleDetailRepository.find({
      where: {
        scheduleId: scheduleId,
      },
    });

    this.logger.debug(
      `Got update schedule result: ${JSON.stringify(scheduleDetails)}`,
    );

    return scheduleDetails;
  }

  async createScheduleDetail(
    scheduleId: number,
    dto: CreateTripScheduleDetailDto,
  ): Promise<TripScheduleDetail> {
    const newRecord = await this.tripScheduleDetailRepository.create({
      ...dto,
      scheduleId,
    });
    await this.tripScheduleDetailRepository.save(newRecord);
    return newRecord;
  }

  async deleteScheduleDetail(scheduleDetailId: number): Promise<boolean> {
    const deleteResult = await this.tripScheduleDetailRepository.delete({
      id: scheduleDetailId,
    });

    this.logger.debug(
      `Got delete schedule detail result: ${JSON.stringify(deleteResult)}`,
    );

    return true;
  }

  async updateScheduleDetail(
    scheduleDetailId: number,
    dto: UpdateTripScheduleDetailDto,
  ): Promise<boolean> {
    const updateResult = await this.tripScheduleDetailRepository.update(
      {
        id: scheduleDetailId,
      },
      dto,
    );

    this.logger.debug(
      `Got update schedule result: ${JSON.stringify(updateResult)}`,
    );

    return true;
  }

  async createTripMember(
    tripId: number,
    dto: CreateTripMemberDto,
  ): Promise<TripMember> {
    const newRecord = await this.tripMemberRepository.create({
      ...dto,
      tripId,
    });
    await this.tripMemberRepository.save(newRecord);
    return newRecord;
  }

  async getTripMembers(tripId: number): Promise<TripMemberResponseDto[]> {
    const resp: TripMemberResponseDto[] = [];

    const members = await this.tripMemberRepository.find({
      where: {
        tripId: tripId,
      },
    });

    if (members.length === 0) {
      return resp;
    }

    const userIds = [];
    for (const member of members) {
      userIds.push(member.userId);
    }

    console.log('Get user by ids: ', userIds);
    const users = await this.usersService.getUserByIds(userIds);
    const mapUser: Record<number, User> = {};

    for (const user of users) {
      mapUser[user.id] = user;
    }

    // Fill user info
    for (const member of members) {
      const user = mapUser[member.userId];

      const respItem: TripMemberResponseDto = {
        age: diffYear(new Date(), user.birthDate),
        description: user.description,
        favorites: [user.favorites],
        id: member.id,
        location: user.location,
        name: user.name,
        status: member.status,
        userId: user.id,
      };

      resp.push(respItem);
    }

    return resp;
  }

  async updateTripMember(
    id: number,
    dto: UpdateTripMemberDto,
  ): Promise<boolean> {
    const updateResult = await this.tripMemberRepository.update(
      {
        id: id,
      },
      {
        status: dto.status,
      },
    );

    this.logger.debug('Got update result: ', JSON.stringify(updateResult));
    return true;
  }

  async deleteTripMember(tripMemberId: number): Promise<boolean> {
    const deleteResult = await this.tripMemberRepository.delete({
      id: tripMemberId,
    });

    this.logger.debug(
      `Got delete trip member result: ${JSON.stringify(deleteResult)}`,
    );

    return true;
  }

  async createTripFee(tripId: number, dto: CreateTripFeeDto): Promise<TripFee> {
    // Check is all member
    const tripMembers = await this.tripMemberRepository.find({
      where: {
        tripId: tripId,
      },
    });

    let isAllMember = false;
    if (tripMembers.length === dto.memberIds.length) {
      isAllMember = true;
    }

    const obj: TripFee = {
      tripId: tripId,
      userId: dto.userId,
      name: dto.name,
      isAllMember: isAllMember,
      memberIds: JSON.stringify(dto.memberIds),
      amount: dto.amount,
      userSpendId: dto.userSpendId,
      date: getDateFromDMYString(dto.date),
    };

    const createdObj = await this.tripFeeRepository.create(obj);
    await this.tripFeeRepository.save(createdObj);
    return createdObj;
  }

  async updateTripFee(
    tripFeeId: number,
    dto: UpdateTripFeeDto,
  ): Promise<boolean> {
    // Check is all member
    const tripFeeRecord = await this.tripFeeRepository.findOne({
      where: {
        id: tripFeeId,
      },
    });

    if (!tripFeeRecord) {
      throw new HttpException('Invalid trip', HttpStatus.BAD_REQUEST);
    }

    const tripMembers = await this.tripMemberRepository.find({
      where: {
        tripId: tripFeeRecord.tripId,
      },
    });

    let isAllMember = false;
    if (tripMembers.length === dto.memberIds.length) {
      isAllMember = true;
    }

    const updateResult = await this.tripFeeRepository.update(
      {
        id: tripFeeId,
      },
      {
        tripId: tripFeeRecord.tripId,
        name: dto.name,
        isAllMember: isAllMember,
        memberIds: JSON.stringify(dto.memberIds),
        amount: dto.amount,
        userSpendId: dto.userSpendId,
        date: getDateFromDMYString(dto.date),
      },
    );

    console.log(`Got update result: ${JSON.stringify(updateResult)}`);

    return true;
  }

  async getTripFee(tripId: number): Promise<TripFee[]> {
    const tripFees = await this.tripFeeRepository.find({
      where: {
        tripId: tripId,
      },
    });

    return tripFees;
  }
}
