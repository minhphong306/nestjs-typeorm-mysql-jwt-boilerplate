import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from '../database/database.module';
import { AuthenticationModule } from '../auth/authentication.module';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     SERVICE_NAME: Joi.string().required(),
    //     NODE_ENV: Joi.string().required(),
    //     PORT: Joi.number().required(),
    //     JWT_SECRET: Joi.string().required(),
    //     JWT_EXPIRATION_TIME: Joi.string().required(),
    //
    //     MYSQL_HOST: Joi.string().required(),
    //     MYSQL_PORT: Joi.number().required(),
    //     MYSQL_USER: Joi.string().required(),
    //     MYSQL_PASSWORD: Joi.string().required(),
    //     MYSQL_DB: Joi.string().required(),
    //
    //     QUERY_LOG_ENABLE: Joi.boolean().required(),
    //     MAX_QUERY_RETRY: Joi.number().required(),
    //   }),
    // }),
    // DatabaseModule,
    // AuthenticationModule,
    // UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
