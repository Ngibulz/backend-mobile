import { BuidlingEnum } from './../../role/building.enum';
import {  IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FacilitiesCreate64Dto {


    @IsString()
    @IsNotEmpty()
    facilitiesName: string;


    @IsString()
    @IsNotEmpty()
    description : string;

    @IsNotEmpty()
    @IsEnum(BuidlingEnum)
    building : BuidlingEnum[]

    @IsString()
    @IsNotEmpty()
    uploadfacil:string;
}