import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { RolesGuard } from './../role/roles.guard';
import { userCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { Controller, Get } from "@nestjs/common";
import { Body, Post, UseGuards, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/util/roles.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        ) { }

    @Get('/getuser')
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getAll(){
        return this.userService.getAllUser()
    }

    @Post('/signup')
    @UsePipes(new ValidationPipe)
    async signUp(@Body() userCreateDto : userCreateDto){
        return this.userService.signUp(userCreateDto);
    }
}