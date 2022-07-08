import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import User from './entities/users.entity';
import { GetUserInfoBody } from './types/getUserInfo';
import { UpdateUserInfoBody } from './types/updateUserInfo';
import { HttpResponse } from '../../types/http-response';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(JwtAuthenticationGuard)
  // @Get('get-info')
  // public async getInfo(@Req() request: RequestWithUser): Promise<User> {
  //   console.log('Receive request get-info with payload: ', request.user);
  //   const user = await this.usersService.getById(request.user.id);
  //   user.password = undefined;
  //   return user;
  // }
  //
  // @UseGuards(JwtAuthenticationGuard)
  // @Post('update-info')
  // public async updateInfo(
  //   @Req() request: RequestWithUser,
  //   @Body() body: UpdateInfoBody,
  // ): Promise<HttpResponse> {
  //   console.log('Receive request update-info with payload: ', request.user);
  //   const success = await this.usersService.updateUserInfo(
  //     request.user.id,
  //     body,
  //   );
  //
  //   return {
  //     success: success,
  //     message: '',
  //   };
  // }

  @Post('/:userId')
  public async getUserInfo(
    @Param('userId', new ParseIntPipe()) userId,
    @Body() body: GetUserInfoBody,
  ): Promise<User> {
    console.log(
      'Receive request get info with payload: ',
      userId,
      ' => ',
      body,
    );
    return await this.usersService.getUserInfo(userId, body);
  }

  @Post('/update/:userId')
  public async updateUserInfo(
    @Param('userId', new ParseIntPipe()) userId,
    @Body() body: UpdateUserInfoBody,
  ): Promise<HttpResponse> {
    this.logger.debug(
      `Receive request to user ${userId} with body: ${JSON.stringify(body)}`,
    );
    const status = await this.usersService.updateUserInfo(userId, body);
    return {
      success: status,
    };
  }
}
