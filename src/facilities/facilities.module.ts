import { AliOssHelperModule } from './../ali-oss/ali-oss.module';
import { FacilitiesService } from './facilities.service';
import { FacilitiesController } from './facilities.controller';
import { Building } from './../entities/building.entity';
import { Facilities } from './../entities/facilities.entity';

import { User } from './../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from "@nestjs/common";

@Module({
    imports: [
      TypeOrmModule.forFeature([
        User,
        Facilities,
        Building,
      ]),
      forwardRef(()=>AliOssHelperModule),

  
    ],
    controllers: [FacilitiesController],
    providers: [FacilitiesService],
    exports: [FacilitiesService]
  })
  export class FacilitiesModule {}