import { IJWTPayload } from './jwt-payload.interface';
import { Role } from './../role/role.enum';
import { UserLoginDto } from './dto/user-login.dto';
import { UserService } from './../user/user.service';
import { forwardRef, Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
   // private readonly globalmodule : string = "auth";
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UserService))
        private userService: UserService,


        ) { }
    
        async signIn(loginDto: UserLoginDto): Promise<Object> {

            const user = await this.userService.signIn(loginDto)
            const accesstoken :string  = this.getJwtAccessToken(user.email,user.role,loginDto.remember,user.userId,user.fullName,user.phoneNum);
            const jwt: any = this.decodeJwtAccessToken(accesstoken);
            delete user.password;
            return { user, accesstoken }
        }

        getJwtAccessToken(
            email: string, 
            role : Role[],
            remember : boolean ,
            userId : number,
            fullname:string,
            phoneNum:string,)
            {
            const payload: IJWTPayload = { email,role,userId,fullname,phoneNum};
            let token
            if(remember == true){ token = this.jwtService.sign(payload ,{expiresIn:"7d"})}
            else{ token = this.jwtService.sign(payload,{expiresIn:"2h"});}
            return token
        }

        decodeJwtAccessToken(token) {
            return this.jwtService.decode(token)
        }
}