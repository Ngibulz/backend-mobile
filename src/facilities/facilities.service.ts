import { use } from 'passport';
import { uuid4 } from '@sentry/utils';
import { BuidlingEnum } from './../role/building.enum';
import { Role } from 'src/role/role.enum';
import { FacilitiesCreateDto } from './dto/facilities-create.dto';
import { Building } from './../entities/building.entity';
import { User } from './../entities/user.entity';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository, DataSource, UpdateResult } from 'typeorm';
import * as bc from 'bcrypt'
import { Facilities } from 'src/entities/facilities.entity';
import * as path from 'path';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class FacilitiesService {

    private readonly logger = new Logger(FacilitiesService.name);
    constructor(
        private dataSource : DataSource,
        @InjectRepository(Facilities)
        private facilitiesRepository: Repository<Facilities>,
        @InjectRepository(Building)
        private buildingRepository : Repository<Building>
    ) { }


    async getAllFacilities(){
        const facilities = await this.facilitiesRepository
        .createQueryBuilder('f')
        .leftJoin("f.createdby","u")
        .leftJoin("f.building","b")
        .select([
            "f.facilitiesId",
            "f.facilitiesName",
            "f.status",
            "f.description",
            "f.ticketNum",
            "b.buildingId",
            "b.buildingName",
        ])
        .getMany()
        return facilities;
    }

    async getAllBuilding(){
        const building = await this.buildingRepository
        .createQueryBuilder('b')
        .leftJoin('b.facilities','f')
        .select([
            "f.facilitiesId",
            "f.facilitiesName",
            "f.status",
            "f.description",
            "f.ticketNum",
            "f.imgPath",
            "b.buildingId",
            "b.buildingName",
        ])
        .getMany()
        return building
    }

    async getAllBuildingOnly(){
        const building = await this.buildingRepository
        .createQueryBuilder('b')
        //.leftJoin('b.facilities','f')
        .select([
            // "f.facilitiesId",
            // "f.facilitiesName",
            // "f.status",
            // "f.description",
            // "f.ticketNum",
            "b.buildingId",
            "b.buildingName",
        ])
        .getMany()
        return building
    }

    async getBuidlingWithFacilWhere(name : string){
        const building = await this.buildingRepository
        .createQueryBuilder('b')
        .leftJoin('b.facilities','f')
        .select([
            "b.buildingId",
            "b.buildingName",
            "f.facilitiesId",
            "f.facilitiesName",
            "f.status",
            "f.description",
            "f.ticketNum",
            "f.imgPath"
        ])
        .where("b.buildingName = :names",{names:name})
        .getMany()
        return building
    }

    async getSpecificFacilWithinBuilding(name : string,id:number){
        const building = await this.facilitiesRepository
        .createQueryBuilder('f')
        .leftJoin('f.building','b')
        .select([
            "f.facilitiesId",
            "f.facilitiesName",
            "f.status",
            "f.description",
            "f.ticketNum",
            "f.imgPath",
        ])
        .where("f.facilitiesId =:fid",{fid:id})
        .andWhere("b.buildingName = :names",{names:name})
        .getMany()

        console.log(building);
        
        return building
    }

    async postFacilities(facilitiesDto : FacilitiesCreateDto,filepath:string,userid:number){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const buildingTRepository = manager.getRepository<Building>(Building)
            const userTRepository = manager.getRepository<User>(User);
            const user = await userTRepository.findOneBy({userId:userid})
            if(!user){
                throw new NotFoundException("User not found")
            }
            const building = await buildingTRepository.findOneBy({buildingName:facilitiesDto.building[0]})
            if(!building){
                throw new NotFoundException("Building not found")
            }
            console.log(building);
            
            const facil = await facilitiesTRepository.create({
                facilitiesName:facilitiesDto.facilitiesName,
                ticketNum:`${facilitiesDto.facilitiesName}${uuid4()}`,
                description:facilitiesDto.description,
                building:building,
                imgPath:filepath,
                createdby:user    
            })

            const saveFacil = await facilitiesTRepository.save(facil)
            return saveFacil;

        }) 
    }

    async completeReport(faciltiesId:number){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const facilToUpdate = await facilitiesTRepository.findOneBy({
                facilitiesId:faciltiesId
            })
            if(facilToUpdate.status!=0){
                throw new BadRequestException("Report status invalid, must be pending")
            }
            await facilitiesTRepository.update(facilToUpdate.facilitiesId,{
                status:1
            })
            return "OK";
        })
    }

}