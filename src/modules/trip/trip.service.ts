import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private tripMemberRepository: Repository<TripMember>,
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

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  update(id: number, updateTripDto: UpdateTripDto) {
    return `This action updates a #${id} trip`;
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
}
