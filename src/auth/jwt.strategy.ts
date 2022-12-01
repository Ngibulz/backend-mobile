import { ConfigService } from '@nestjs/config/dist';
import { BadRequestException, Injectable, Redirect, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../user/user.service";
import { IJWTPayload } from "./jwt-payload.interface";
import { User } from "../entities/user.entity";
import { Request, response } from "express";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){

    constructor(
        private readonly userService: UserService,
        private readonly configService : ConfigService

    ){
        super({
            secretOrKey: configService.get("JWT_SECRET"),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromHeader("accesstoken")
 
        })
    }

    async validate(payload: IJWTPayload): Promise<User> {
        
        const { email } = payload;
        const user: User = await this.userService.getOneByEmail(email)
        
        if (!user) {
           // console.log(jwt);
            throw new UnauthorizedException("Token Tidak Valid atau Sudah Expired")
        }

        delete user.password

        return user;
    }
}