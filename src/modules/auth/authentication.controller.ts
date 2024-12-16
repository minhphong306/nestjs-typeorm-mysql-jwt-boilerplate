import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RequestWithUser from './intefaces/requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { LoginBody } from './intefaces/loginBody.interface';
import RegisterDto from '../users/dto/register.dto';
import { UsersService } from '../users/user.service';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

// Convert exec to promise-based function
const exec = promisify(execCallback);

async function runScript() {
  try {
    const { stdout, stderr } = await exec('sh bash/hello.sh');

    if (stdout) {
      console.log('Standard output:', stdout);
    }

    if (stderr) {
      console.log('Standard error:', stderr);
    }

    return { stdout, stderr };
  } catch (error) {
    console.error('Execution error:', error);
    throw error;
  }
}

@Controller('authentication')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService,
    private readonly userService: UsersService,
  ) { }

  @Get('runscript')
  async runscript() {
    await runScript()
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    console.log('Got registration data: ', JSON.stringify(registrationData));

    // Verify user exist
    const userExist = await this.authenticationService.checkUserExist(registrationData.username);
    if (userExist) {
      throw new HttpException(
        'User already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @Post('log-in')
  async logIn(@Body() body: LoginBody) {
    return this.authenticationService.login(body);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    console.log('Got logout req: ', request);
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }
}
