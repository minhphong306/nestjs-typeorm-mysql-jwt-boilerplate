import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/types';

@Entity({
  name: 'users',
})
class User {
  @PrimaryColumn()
  public id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  public phone: string;

  @Column({
    nullable: false,
  })
  public name: string;

  @Column({
    nullable: false,
  })
  public email: string;

  @Column({
    nullable: false,
  })
  public type: UserType;

  @Column({
    nullable: false,
    default: false,
  })
  public isCompleteOnboarding: boolean;

  @Column({
    nullable: false,
    default: '{}',
  })
  public onboardingConfig: string;

  @Column({
    nullable: false,
    default: '[]',
  })
  public featureImages: string;

  @Column({
    nullable: true,
  })
  public birthDate?: Date;

  @Column({
    nullable: false,
    default: '{}',
  })
  public guessConfig: string;

  @Column({
    nullable: false,
    default: '{}',
  })
  public guideConfig: string;

  @Column({
    nullable: false,
    default: '{}',
  })
  public friendConfig: string;

  @Column({
    nullable: false,
    default: false,
  })
  public isVerified: boolean;

  @Column({
    nullable: false,
    default: '{}',
  })
  public verificationConfig: string;

  @Column({
    nullable: true,
  })
  public description: string;

  @Column({
    nullable: true,
  })
  public favorites: string;

  @Column({
    nullable: true,
  })
  public location: string;

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

export default User;
