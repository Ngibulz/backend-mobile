import { User } from './../entities/user.entity';
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    constructor(
        private dataSource : DataSource
    ) { }


    async getAllUser(){
        return await this.dataSource.transaction(async manager=>{
            const userTRepository = manager.getRepository<User>(User);
            return await userTRepository
            .createQueryBuilder("user")
            .getMany()
        })
    }

}