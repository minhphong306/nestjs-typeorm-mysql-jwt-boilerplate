import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { UpdateInfoBody } from './types/update-info-body';
import User from './entities/users.entity';
import { HttpResponse } from '../../types/http-response';
import RequestWithUser from '../auth/intefaces/requestWithUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get('get-info')
  public async getInfo(@Req() request: RequestWithUser): Promise<User> {
    console.log('Receive request get-info with payload: ', request.user);
    const user = await this.usersService.getById(request.user.id);
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('update-info')
  public async updateInfo(
    @Req() request: RequestWithUser,
    @Body() body: UpdateInfoBody,
  ): Promise<HttpResponse> {
    console.log('Receive request update-info with payload: ', request.user);
    const success = await this.usersService.updateUserInfo(
      request.user.id,
      body,
    );

    return {
      success: success,
      message: '',
    };
  }
}
