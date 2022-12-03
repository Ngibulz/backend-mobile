import { BuidlingEnum } from './../../role/building.enum';
import {  IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FacilitiesCreateDto {


    @IsString()
    @IsNotEmpty()
    facilitiesName: string;


    @IsString()
    @IsNotEmpty()
    description : string;

    @IsNotEmpty()
    @IsEnum(BuidlingEnum)
    building : BuidlingEnum[]
}