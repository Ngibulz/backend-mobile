import { AliOssHelperService } from './../ali-oss/ali-oss.service';
import { use } from 'passport';
import { uuid4 } from '@sentry/utils';
import { BuidlingEnum } from './../role/building.enum';
import { Role } from 'src/role/role.enum';
import { FacilitiesCreateDto } from './dto/facilities-create.dto';
import { Building } from './../entities/building.entity';
import { User } from './../entities/user.entity';
import { BadRequestException, forwardRef, Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository, DataSource, UpdateResult } from 'typeorm';
import * as bc from 'bcrypt'
import { Facilities } from 'src/entities/facilities.entity';
import * as path from 'path';
import { NotFoundException } from '@nestjs/common/exceptions';
import { FacilitiesCreate64Dto } from './dto/facilities-create-base64 copy';
import * as fs from 'fs';

@Injectable()
export class FacilitiesService {

    private readonly logger = new Logger(FacilitiesService.name);
    constructor(
        @Inject(forwardRef(()=>AliOssHelperService))
        private readonly ossService : AliOssHelperService,
        private dataSource : DataSource,
        @InjectRepository(Facilities)
        private facilitiesRepository: Repository<Facilities>,
        @InjectRepository(Building)
        private buildingRepository : Repository<Building>
    ) { }


    async getAllFacilities(role:string,email:string){
        let facilities;
        if(role == Role.Admin){
            facilities = await this.facilitiesRepository
            .createQueryBuilder('f')
            .leftJoin("f.createdby","u")
            .leftJoin("f.building","b")
            .select([
                "f.facilitiesId",
                "f.facilitiesName",
                "f.status",
                "f.description",
                "f.ticketNum",
                "f.imgPath",
                "f.createdDate",
                "f.updatedDate",
                "b.buildingId",
                "b.buildingName",
                "u.userId",
                "u.fullName",
                "u.email"
            ])
            .getMany()
        } else {
            facilities = await this.facilitiesRepository
            .createQueryBuilder('f')
            .leftJoin("f.createdby","u")
            .leftJoin("f.building","b")
            .select([
                "f.facilitiesId",
                "f.facilitiesName",
                "f.status",
                "f.description",
                "f.ticketNum",
                "f.imgPath",
                "f.createdDate",
                "f.updatedDate",
                "b.buildingId",
                "b.buildingName",
                "u.userId",
                "u.fullName",
                "u.email"
            ])
            .where("u.email = :emails",{emails:email})
            .getMany()
        }
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
            "f.createdDate",
            "f.updatedDate",
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
            "b.description",
        ])
        .getMany()
        return building
    }

    async getBuidlingWithFacilWhere(name : string,email:string,role:string){
        let building;
        if(role==Role.Admin){
            building = await this.facilitiesRepository
            .createQueryBuilder('f')
            .leftJoin('f.building','b')
            .leftJoin("f.createdby","u")
            .select([
                "f.facilitiesId",
                "f.facilitiesName",
                "f.status",
                "f.description",
                "f.ticketNum",
                "f.imgPath",
                "f.createdDate",
                "f.updatedDate",
                "b.buildingId",
                "b.buildingName",
                "u.userId",
                "u.fullName",
                "u.email"
            ])
            .andWhere("b.buildingName = :names",{names:name})
            .getMany()
        } else {
            building = await this.facilitiesRepository
            .createQueryBuilder('f')
            .leftJoin('f.building','b')
            .leftJoin("f.createdby","u")
            .select([
                "f.facilitiesId",
                "f.facilitiesName",
                "f.status",
                "f.description",
                "f.ticketNum",
                "f.imgPath",
                "f.createdDate",
                "f.updatedDate",
                "b.buildingId",
                "b.buildingName",
                "u.userId",
                "u.fullName",
                "u.email"
            ])
            .where("u.email = :emails",{emails:email})
            .andWhere("b.buildingName = :names",{names:name})
            .getMany()
        }

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
            "f.createdDate",
            "f.updatedDate"
        ])
        .where("f.facilitiesId =:fid",{fid:id})
        .andWhere("b.buildingName = :names",{names:name})
        .getMany()

        console.log(building);
        
        return building
    }

    async postFacilities(facilitiesDto : FacilitiesCreateDto,userid:number,file:Express.Multer.File){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const buildingTRepository = manager.getRepository<Building>(Building)
            const userTRepository = manager.getRepository<User>(User);
            const user = await userTRepository.findOneBy({userId:userid})
            const datenow = new Date().toLocaleDateString('en-CA');
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
                //imgPath:filename,
                createdby:user,
                createdDate:  datenow,
                updatedDate:datenow,  
            })

            const saveFacil = await facilitiesTRepository.save(facil)
            
            delete saveFacil.imgPath
            delete saveFacil.building
            console.log(saveFacil);
            
            return saveFacil;

        }) 
    }

    async completeReport(faciltiesId:number){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const facilToUpdate = await facilitiesTRepository.findOneBy({
                facilitiesId:faciltiesId
            })
            if(facilToUpdate.status=="fix" || facilToUpdate.status=="done"){
                throw new BadRequestException("Report status invalid, must be pending")
            }
            await facilitiesTRepository.update(facilToUpdate.facilitiesId,{
                status:"fix"
            })
            return "OK";
        })
    }

    async completeReportDone(faciltiesId:number){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const facilToUpdate = await facilitiesTRepository.findOneBy({
                facilitiesId:faciltiesId
            })
            if(facilToUpdate.status=="pending" || facilToUpdate.status=="done"){
                throw new BadRequestException("Report status invalid, must be fix")
            }
            await facilitiesTRepository.update(facilToUpdate.facilitiesId,{
                status:"done"
            })
            return "OK";
        })
    }

    async getFacilCountPerBuilding(buildingName:string){
        // const count = await manager.count(User, {
        //     where: {
        //         firstName: "Timber",
        //     },
        // })
        // const buildings = await this.buildingRepository.findOneBy({
        //     buildingName:buildingName[0]
        // })
        
        const facilbuild = await this.facilitiesRepository
        .createQueryBuilder('f')
        .leftJoin('f.building','b')
        .where("b.buildingName = :names",{names:buildingName})
        .getCount()

        return facilbuild
 
    }

    async postFacilitiesBase64(facilitiesDto : FacilitiesCreate64Dto,userid:number){
        return await this.dataSource.transaction(async manager=>{
            const facilitiesTRepository =  manager.getRepository<Facilities>(Facilities);
            const buildingTRepository = manager.getRepository<Building>(Building)
            const userTRepository = manager.getRepository<User>(User);
            const user = await userTRepository.findOneBy({userId:userid})
            const datenow = new Date().toLocaleDateString('en-CA');
            if(!user){
                throw new NotFoundException("User not found")
            }
            const building = await buildingTRepository.findOneBy({buildingName:facilitiesDto.building[0]})
            if(!building){
                throw new NotFoundException("Building not found")
            }
            console.log(building);
            // const ll = Buffer.from(facilitiesDto.uploadfacil,'base64');
            // console.log(ll);
            
            const filename = `a${uuid4()}-${facilitiesDto.facilitiesName}`
            await this.ossService.saveFile(filename,Buffer.from(facilitiesDto.uploadfacil,'base64') )
            const facil = await facilitiesTRepository.create({
                facilitiesName:facilitiesDto.facilitiesName,
                ticketNum:`${facilitiesDto.facilitiesName}${uuid4()}`,
                description:facilitiesDto.description,
                building:building,
                imgPath:filename,
                createdby:user,
                createdDate:  datenow,
                updatedDate:datenow,  
            })
            //console.log(filename);
            //await fs.writeFileSync("new-path.jpg", ll);
            const saveFacil = await facilitiesTRepository.save(facil)
            delete saveFacil.imgPath
            delete saveFacil.createdby
            delete saveFacil.building
            delete saveFacil.updated_at
            delete saveFacil.created_at
            return saveFacil;

        }) 
    }

    async getSpecificFacilId(id:number){
        const building = await this.facilitiesRepository
        .createQueryBuilder('f')
        .leftJoin('f.building','b')
        .leftJoin('f.createdby','u')
        .select([
            "f.facilitiesId",
            "f.facilitiesName",
            "f.status",
            "f.description",
            "f.ticketNum",
            "f.imgPath",
            "f.createdDate",
            "f.updatedDate",
            "b.buildingId",
            "b.buildingName",
            "u.userId",
            "u.fullName",
            "u.email"
        ])
        .where("f.facilitiesId =:fid",{fid:id})
        .getOne()

        return building
    }



}