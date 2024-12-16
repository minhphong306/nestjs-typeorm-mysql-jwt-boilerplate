import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { RunService } from './run.service';
import { ConfigService } from '@nestjs/config';

@Controller('run')
export class RunController {
  constructor(
    private readonly runService: RunService,
    private readonly configService: ConfigService,
  ) {}

  @Get('playwright-test')
  async runPlaywrightTest(
    @Query('testName') testName: string,
    @Query('secret') secret: string,
  ) {
    const expectedSecret = this.configService.get<string>('API_SECRET');
    console.log('secret', secret);
    console.log('expectedSecret', expectedSecret);
    
    if (!secret || secret !== expectedSecret) {
      throw new UnauthorizedException('Invalid API secret');
    }

    if (!testName) {
      throw new Error('Test name parameter is required');
    }

    return this.runService.runPlaywrightTest(testName);
  }
}
