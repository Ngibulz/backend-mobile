import { Role } from './../../role/role.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, isNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "src/util/match.decorator";
import { IsNull } from "typeorm";

export class userCreateDto{
    @IsEmail()
    @IsString()
    @IsNotEmpty({message:'Email is required'})
    email : string;

    @IsNotEmpty()
    @IsString()
    fullName : string;

    @IsNotEmpty()
    @IsNumber()
    userNumber : number;

    @IsNotEmpty()
    @IsString()
    phoneNumber : string


    // @IsNotEmpty()
    // @IsEnum(Role)
    // role : Role[];

    @IsNotEmpty()
    @IsString()
    department : string;


}