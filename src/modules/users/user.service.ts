import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entities/users.entity';
import { GetUserInfoBody } from './types/getUserInfo';
import { UserType } from './enum/types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // async getByPhone(phone: string): Promise<User> {
  //   const user = await this.usersRepository.findOne({
  //     where: {
  //       phone: phone,
  //     },
  //   });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException(
  //     'User with this phone does not exist',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
  //
  // async create(userData: CreateUserDto): Promise<User> {
  //   const newUser = await this.usersRepository.create(userData);
  //   newUser.bankInfo = JSON.stringify({
  //     name: '',
  //     branch: '',
  //     number: '',
  //   });
  //   newUser.balance = 0;
  //   await this.usersRepository.save(newUser);
  //   return newUser;
  // }
  //
  // async getById(id: number): Promise<User> {
  //   const user = await this.usersRepository.findOne({
  //     where: {
  //       id: id,
  //     },
  //   });
  //   if (user) {
  //     return user;
  //   }
  //   throw new HttpException(
  //     'User with this id does not exist',
  //     HttpStatus.NOT_FOUND,
  //   );
  // }
  //
  // async updateUserInfo(id: number, body: UpdateInfoBody): Promise<boolean> {
  //   const user = await this.usersRepository.findOne({
  //     where: {
  //       id: id,
  //     },
  //   });
  //
  //   if (!user) {
  //     this.logger.error(`User with id ${id} does not exist`);
  //     throw new HttpException(
  //       'User with this id does not exist',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //
  //   const updateResult = await this.usersRepository.update(
  //     {
  //       id: id,
  //     },
  //     {
  //       name: body.name,
  //       bankInfo: JSON.stringify(body.bankInfo),
  //     },
  //   );
  //
  //   this.logger.debug(`Update result: ${safeStringify(updateResult)}`);
  //   return true;
  // }

  async getUserInfo(body: GetUserInfoBody): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        id: body.id,
      },
    });

    if (user) {
      return user;
    }

    // not exist -> create default user
    this.logger.debug(`Create default user`);
    const defaultUser: User = {
      id: body.id,
      email: body.email,
      featureImages: '[]',
      friendConfig: '{}',
      guessConfig: '{}',
      guideConfig: '{}',
      isVerified: false,
      name: body.name,
      phone: body.phone,
      type: UserType.Guest,
      verificationConfig: '{}',
      isCompleteOnboarding: false,
      onboardingConfig: '{}',
    };

    const newUser = await this.usersRepository.create(defaultUser);
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
