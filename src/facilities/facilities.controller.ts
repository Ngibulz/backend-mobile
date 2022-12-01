import { User } from './../entities/user.entity';
import { RolesGuard } from './../role/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

import { Controller, Get } from "@nestjs/common";
import { Body, Param, Post, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { FacilitiesService } from "./facilities.service";
import { Roles } from 'src/util/roles.decorator';
import { Role } from 'src/role/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('facilities')
export class FacilitiesController {
    constructor(
        private readonly facilitiesService: FacilitiesService,
        ) { }

    @Get('getAllFacilities')
    @Roles(Role.User)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getAllFacilities(@GetUser() getuser:User){
        console.log(getuser.userId);
        console.log(getuser.email);
        return this.facilitiesService.getAllFacilities()
    }

    @Get('getAllBuildingWithFacil')
    async getAllBuilding(){
        return this.facilitiesService.getAllBuilding();
    }

    @Get('getBuilding')
    async getBuilding(){
        return this.facilitiesService.getAllBuildingOnly();
    }

    @Get('getFacilities/:buildingName')
    async getFacilByBuilding(@Param('buildingName') buildingId:string){
        return this.facilitiesService.getBuidlingWithFacilWhere(buildingId);
        
    }

    @Get('getFacilities/:buildingName/:id')
    async getFacilInSpecBuidling(@Param('buildingName') buildingId:string,@Param('id') id:number){
        return this.facilitiesService.getSpecificFacilWithinBuilding(buildingId,id);
        
    }

}