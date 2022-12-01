import { JWTStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { forwardRef, Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config/dist';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    JwtModule.registerAsync({
      useFactory: async (configService : ConfigService)=>({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: 3600
        }
      }),
      inject:[ConfigService],
      
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy,],
  exports: [ AuthService,]
})
export class AuthModule { }
