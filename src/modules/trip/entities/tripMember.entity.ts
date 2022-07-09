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
export default class TripMember {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    nullable: false,
  })
  public tripId: number;

  @Column({
    nullable: false,
  })
  public userId: number;

  @Column({
    nullable: false,
  })
  public status: TripMemberStatus;

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
