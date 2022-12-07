import { UserLoggerMiddleware } from './middleware/user-logger.middleware';
import { FacilitiesModule } from './facilities/facilities.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'backendmobile',
        entities: [
          __dirname + '/entities/*.entity{.ts,.js}'
        ],
        synchronize: true,
    }),
    UserModule,
    AuthModule,
    FacilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserLoggerMiddleware).forRoutes('*');
  }
}
