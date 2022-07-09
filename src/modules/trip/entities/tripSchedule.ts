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

@Entity()
export default class TripSchedule {
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
  public name: string;

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
