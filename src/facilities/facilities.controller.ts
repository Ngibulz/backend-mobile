import { BuidlingEnum } from './../role/building.enum';
import { Building } from './../entities/building.entity';
import { AuthGuard } from '@nestjs/passport';

import { extname } from 'path';
import { uuid4 } from '@sentry/utils';
import { imageFileFilter } from './../util/file_upload.util';
import { User } from './../entities/user.entity';
import { RolesGuard } from './../role/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

import { Controller, Get } from "@nestjs/common";
import { Body, Param, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { FacilitiesService } from "./facilities.service";
import { Roles } from 'src/util/roles.decorator';
import { Role } from 'src/role/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { FacilitiesCreateDto } from './dto/facilities-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import * as path from 'path';
import { BadRequestException } from '@nestjs/common/exceptions';
import {  Request } from 'express';
import { FacilitiesCreate64Dto } from './dto/facilities-create-base64 copy';

@Controller('facilities')
export class FacilitiesController {
    constructor(
        private readonly facilitiesService: FacilitiesService,
        ) { }

    @Get('getAllFacilities')
    // @Roles(Role.User)
    // @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getAllFacilities(@GetUser() getuser:User,@Req() req:Request){
        console.log(getuser.userId);
        console.log(getuser.email);
        console.log(req.headers);
        console.log();
        const facils = await this.facilitiesService.getAllFacilities()
        console.log(facils);
        
        return facils

    }

    @Get('getAllBuildingWithFacil')
    @UseGuards(JwtAuthGuard)
    async getAllBuilding(){
        return this.facilitiesService.getAllBuilding();
    }

    @Get('getBuilding')
    async getBuilding(){
        
        return this.facilitiesService.getAllBuildingOnly();
    }

    @Get('getFacilities/:buildingName')
    @UseGuards(JwtAuthGuard)
    async getFacilByBuilding(@Param('buildingName') buildingId:string){
        return this.facilitiesService.getBuidlingWithFacilWhere(buildingId);
        
    }

    @Get('getFacilities/:buildingName/:id')
    @UseGuards(JwtAuthGuard)
    async getFacilInSpecBuidling(@Param('buildingName') buildingId:string,@Param('id') id:number){
        return this.facilitiesService.getSpecificFacilWithinBuilding(buildingId,id);
        
    }

    @Post('postFacilitiesLegacy')
    @UsePipes(new ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor("uploadfacil",{
            fileFilter:imageFileFilter,
        })
    )
    async postFacility(
        @Body() facilitiesDto:FacilitiesCreateDto,
        @UploadedFile() uploadfacil:Express.Multer.File,
        @GetUser() getuser,
        @Req() req:Request):Promise<any>{
        console.log(req.headers['content-type']);
        
            if(!uploadfacil){
                throw new BadRequestException('You must upload file')
            }
        console.log(path.join(__dirname,"..","img"));
        console.log(uploadfacil)
        console.log(uploadfacil.buffer);

        let facilpost = await  this.facilitiesService.postFacilities(facilitiesDto,getuser.userId,uploadfacil)
        // delete facilpost.building,
        // delete facilpost.imgPath;
        return facilpost;
    }

    @Put("updateStatus/:id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async updateFacilStatusById(@Param('id') id:number){
        return this.facilitiesService.completeReport(id);
    }

    @Put("updateStatusDone/:id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async updateFacilStatusByIdtoDone(@Param('id') id:number){
        return this.facilitiesService.completeReportDone(id);
    }


    @Get("count/:name")
    async getcount(@Param('name') names:string){
        return this.facilitiesService.getFacilCountPerBuilding(names);
    }


    @Post('postFacilities')
    @UsePipes(new ValidationPipe)
    @UseGuards(JwtAuthGuard)
    async postFacility64(
        @Body() facilitiesDto:FacilitiesCreate64Dto,
        @GetUser() getuser,
        @Req() req:Request):Promise<any>{
        console.log(req.headers['content-type']);

        return this.facilitiesService.postFacilitiesBase64(facilitiesDto,getuser.userId)
    }

    @Get('getFacil/:id')
    @UseGuards(JwtAuthGuard)
    async getFacilById(@Param('id') id:number){
        return this.facilitiesService.getSpecificFacilId(id)
    }
}