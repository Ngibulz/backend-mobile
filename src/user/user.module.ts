import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";

@Module({
    imports: [
      TypeOrmModule.forFeature([
        User
      ]),
  
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
  })
  export class UserModule {}