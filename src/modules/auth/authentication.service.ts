import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import { JwtPayload } from './intefaces/token-payload.interface';
import * as bcrypt from 'bcrypt';
import { LoginBody } from './intefaces/loginBody.interface';
import RegisterDto from '../users/dto/register.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      this.logger.error('Got err when register: ', JSON.stringify(error));
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUserExist(username: string): Promise<boolean> {
    return false;
  }

  public async getAuthenticatedUser(username: string, originalPassword: string) {
    try {
      const user = await this.usersService.getByUsername(username);
      const isPasswordMatching = await bcrypt.compare(
        originalPassword,
        user.password, // hashed password
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: number, username: string, name: string) {
    const payload: JwtPayload = {
      userId: userId,
      username: username,
      name: name,
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
    const user = await this.getAuthenticatedUser(body.username, body.password);

    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }
}
