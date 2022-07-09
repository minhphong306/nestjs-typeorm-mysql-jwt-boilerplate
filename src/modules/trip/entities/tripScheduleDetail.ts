import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status, TripMemberStatus } from '../enum/status';
import { CategoryType } from '../enum/categoryType';
import { TransportType } from '../enum/transportType';

@Entity()
export default class TripScheduleDetail {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    nullable: false,
  })
  public userId: number;

  @Column({
    nullable: false,
  })
  public tripId: number;

  @Column({
    nullable: false,
  })
  public scheduleId: number;

  @Column({
    nullable: false,
  })
  public position: number;

  @Column({
    nullable: false,
  })
  public time: Date;

  @Column({
    nullable: false,
  })
  public transportType: TransportType;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: false,
  })
  public location: string;

  @Column({
    nullable: false,
  })
  public date: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt?: Date;
}
