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
}
