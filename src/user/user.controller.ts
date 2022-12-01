import { userCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { Controller, Get } from "@nestjs/common";
import { Body, Post, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        ) { }

    @Get('/getuser')
    async getAll(){
        return this.userService.getAllUser()
    }

    @Post('/signup')
    @UsePipes(new ValidationPipe)
    async signUp(@Body() userCreateDto : userCreateDto){
        return this.userService.signUp(userCreateDto);
    }
}