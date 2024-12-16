import { Module } from '@nestjs/common';
import { RunController } from './run.controller';
import { RunService } from './run.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [RunController],
  providers: [RunService, ConfigService],
})
export class RunModule {}
