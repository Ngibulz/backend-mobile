
import { extname } from 'path';
import { uuid4 } from '@sentry/utils';
import { imageFileFilter } from './../util/file_upload.util';
import { User } from './../entities/user.entity';
import { RolesGuard } from './../role/roles.guard';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';

import { Controller, Get } from "@nestjs/common";
import { Body, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
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

    @Post('postFacilities')
    @UsePipes(new ValidationPipe)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor("uploadfacil",{
            fileFilter:imageFileFilter,
            storage:diskStorage({
                destination:path.join(__dirname,"..","img"),
                filename: (req: any, file: any, cb: any) => {
                    // Calling the callback passing the random name generated with the original extension name
                    cb(null, `${uuid4()}${extname(file.originalname)}`);
                }
            }),
        })
    )
    async postFacility(
        @Body() facilitiesDto:FacilitiesCreateDto,
        @UploadedFile() uploadfacil:Express.Multer.File):Promise<any>{
            if(!uploadfacil){
                throw new BadRequestException('You must upload file')
            }
            console.log(path.join(__dirname,"..","img"));
        console.log(uploadfacil.filename);
        console.log(uploadfacil.path)
        console.log(uploadfacil.destination);
        
        
        return this.facilitiesService.postFacilities(facilitiesDto,uploadfacil.filename)
    }

}