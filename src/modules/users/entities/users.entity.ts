import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

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
  public password: string;

  @Column({
    name: 'bank_info',
    nullable: false,
  })
  public bankInfo: string;

  @Column({
    type: 'integer',
    default: 0,
    nullable: false,
  })
  public balance: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt?: Date;

  // public id: number;
  // public tikiId: string;
  // public name: string;
  // public featureImages: string;
  // public type: string;
  // public guessConfig: string;
  // public guideConfig: string;
  // public friendConfig: string;
  // public isVerified: boolean;
  // public verificationConfig: boolean;
}

export default User;
