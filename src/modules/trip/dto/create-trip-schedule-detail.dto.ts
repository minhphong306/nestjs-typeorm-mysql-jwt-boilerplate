import { TransportType } from '../enum/transportType';

export class CreateTripScheduleDetailDto {
  public scheduleId: number;
  public position: number;
  public time: string;
  public transportType: TransportType;
  public name: string;
  public location: string;
}
