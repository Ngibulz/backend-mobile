import { ConfigService } from '@nestjs/config/dist';
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
import { AliOssHelperModule } from './ali-oss/ali-oss.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: 3306,
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'backendmobile'),
        entities: [
          __dirname + '/entities/*.entity{.ts,.js}'
        ],
        migrations:[
          __dirname + '/migrations/*{.ts,.js}'
         ],
        autoLoadEntities:true,
        migrationsRun:false,
        migrationsTableName: "migrations_typeorm",
        synchronize: true,
      })
    }),
    UserModule,
    AuthModule,
    FacilitiesModule,
    AliOssHelperModule,

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
