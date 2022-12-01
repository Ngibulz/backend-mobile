import { BuidlingEnum } from './../role/building.enum';
import { Facilities } from './facilities.entity';
import { Role } from './../role/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsPhoneNumber } from "class-validator";

@Entity()

export class Building{
    @PrimaryGeneratedColumn()
    buildingId : number;

    @Column({
        type:'enum',
        enum : BuidlingEnum,
        default :BuidlingEnum.a,
        unique:true
    })
    public buildingName : Building[];

    @OneToMany(()=>Facilities,facilities=>facilities.building,{cascade:['insert','update']})
    facilities:Facilities[];
}