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
}
