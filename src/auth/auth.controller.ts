import { UserLoginDto } from './dto/user-login.dto';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AuthService } from './auth.service';
import { Body, Controller, Logger, Post, Res, UsePipes } from "@nestjs/common";
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private authService: AuthService,
    ) { }

    @Post('/signin')
    @UsePipes(new ValidationPipe())
    async signIn(@Body() loginDto: UserLoginDto,@Res() res : Response) {
        const loginresponse: any = await this.authService.signIn(loginDto);
        const accesstoken = loginresponse.accesstoken;
        console.log(loginresponse);
        res.header('accesstoken',loginresponse.accesstoken);
        res.send({
            success : true,
            accesstoken,
        })
        

    }
}