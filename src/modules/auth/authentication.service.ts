import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtPayload } from './intefaces/token-payload.interface';
import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/register.dto';
import { LoginBody } from './intefaces/loginBody.interface';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    // const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    // try {
    //   const createdUser = await this.usersService.create({
    //     ...registrationData,
    //     password: hashedPassword,
    //   });
    //
    //   createdUser.password = undefined;
    //   return createdUser;
    // } catch (error) {
    //   this.logger.error('Got err when register: ', JSON.stringify(error));
    //   throw new HttpException(
    //     'Something went wrong',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  public async getAuthenticatedUser(phone: string, originalPassword: string) {
    // try {
    //   const user = await this.usersService.getByPhone(phone);
    //   const isPasswordMatching = await bcrypt.compare(
    //     originalPassword,
    //     user.password, // hashed password
    //   );
    //   if (!isPasswordMatching) {
    //     throw new HttpException(
    //       'Wrong credentials provided',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    //   user.password = undefined;
    //   return user;
    // } catch (error) {
    //   throw new HttpException(
    //     'Wrong credentials provided',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: JwtPayload = {
      userId: userId,
      phone: 'abc',
    };
    const token = this.jwtService.sign(payload);
    this.logger.debug('Got jwt signed token:', token);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async login(body: LoginBody): Promise<string> {
    const user = await this.getAuthenticatedUser(body.phone, body.password);

    const payload: JwtPayload = {
      userId: 1,
      phone: 'user.phone',
    };

    return this.jwtService.sign(payload);
  }
}
