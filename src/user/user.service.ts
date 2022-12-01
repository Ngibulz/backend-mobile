import { UserLoginDto } from './../auth/dto/user-login.dto';
import { userCreateDto } from './dto/user-create.dto';
import { User } from './../entities/user.entity';
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository, DataSource, UpdateResult } from 'typeorm';
import * as bc from 'bcrypt'


@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    constructor(
        private dataSource : DataSource,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    async getAllUser(){
        return await this.dataSource.transaction(async manager=>{
            const userTRepository = manager.getRepository<User>(User);
            return await userTRepository
            .createQueryBuilder("user")
            .getMany()
        })
    }

    async signUp(userDto: userCreateDto ){
        return await this.dataSource.transaction(async manager=>{
            const userTRepository = manager.getRepository<User>(User);
            const exist = await userTRepository.findOneBy({ email : userDto.email})
            if(exist){
                throw new BadRequestException("User already exist");
            }
           
            if(userDto.password!=userDto.password_confirmation){
                throw new BadRequestException("Password doesnt matches");
            }
            const salt =await bc.genSalt();
            const hashedPassword = await bc.hash(userDto.password, salt);
            const newUserCreate = await userTRepository.create({
                email:userDto.email,
                password:hashedPassword,
                userNumber:userDto.userNumber,
                fullName:userDto.fullName,
                phoneNum:userDto.phoneNumber,
            })
            const newUser = await userTRepository.save(newUserCreate)
            return newUser
        })
    }

    async getOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({
            email:email
        });
    }

    async signIn(userLoginDto: UserLoginDto): Promise<User> {

        const { email, password } = userLoginDto;
        let message :string
        const user = await this.userRepository.findOneBy({
            email:email
        });

        if(!user){ 
            message = `No user found with email : ${email}`
        }

        

        if (user && (await bc.compare(password, user.password))) {
      
            const userbaru = await this.userRepository.findOneBy({
                email:email
            });
            
            
            return userbaru;
        } else {
            console.log(user);
            throw new UnauthorizedException("Incorrect email or password")
        }
    }
    // async updateIat(user: User, iat: number): Promise<boolean> {
    //     const updated: UpdateResult = await this.userRepository.update(user.Userid, {
    //         last_iat: iat
    //     });

    //     return updated.affected > 0;
    // }

}