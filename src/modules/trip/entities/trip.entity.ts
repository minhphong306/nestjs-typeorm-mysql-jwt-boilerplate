import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../enum/status';
import { CategoryType } from '../enum/categoryType';

@Entity({
  name: 'trip',
})
class Trip {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({
    nullable: false,
  })
  public userId: number;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: false,
  })
  public description: string;

  @Column({
    nullable: true,
    default: '[]',
  })
  public featureImages: string;

  @Column({
    nullable: false,
  })
  public from: Date;

  @Column({
    nullable: false,
  })
  public to: Date;

  @Column({
    nullable: false,
    default: Status.Draft,
  })
  public status: Status;

  @Column({
    nullable: false,
  })
  public categoryType: CategoryType;

  @Column({
    nullable: false,
  })
  public transportTypes: string;

  @Column({
    nullable: false,
  })
  public budgetFrom: number;

  @Column({
    nullable: false,
  })
  public budgetTo: number;

  @Column({
    nullable: false,
  })
  public language: string;

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

export default Trip;
