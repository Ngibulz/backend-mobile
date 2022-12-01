import { Building } from './building.entity';
import { User } from './user.entity';
import { Role } from './../role/role.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsPhoneNumber } from "class-validator";

@Entity()

export class Facilities{
    @PrimaryGeneratedColumn()
    facilitiesId : number;

    @Column({nullable:false})
    facilitiesName : string;

    @Column({nullable:false,unique:true})
    ticketNum : string;

    @Column({nullable:false,default:"gadafile"})
    imgPath : string;

    @Column({nullable:false})
    description : string;

    /**
     * -1 = canceled
     * 0 = pending
     * 1 = done repair
     */
    @Column({type:"tinyint",nullable:false,default:0})
    status : number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(()=>User, user=>user.facilitesCreate)
    @JoinColumn({name:'createdBy'})
    createdby : User

    @ManyToOne(()=>Building,building=>building.facilities,{cascade:['insert','update']})
    @JoinColumn({name:'building'})
    building:Building;

}