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

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { each: true })
    password : string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Match('password')
    password_confirmation: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role : Role[]


}