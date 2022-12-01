import { Building } from './../entities/building.entity';
import { User } from './../entities/user.entity';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository, DataSource, UpdateResult } from 'typeorm';
import * as bc from 'bcrypt'
import { Facilities } from 'src/entities/facilities.entity';


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
        ])
        .where("f.facilitiesId =:fid",{fid:id})
        .andWhere("b.buildingName = :names",{names:name})
        .getMany()

        console.log(building);
        
        return building
    }
}