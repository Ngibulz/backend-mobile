import {  IsBoolean, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UserLoginDto {


    @IsEmail()
    @IsString()
    @IsNotEmpty({message:"Email is required"})
    email: string;


    @IsString()
    @IsNotEmpty({message:"Password is required"})
    password: string;

    @IsBoolean()
    remember : boolean;
}