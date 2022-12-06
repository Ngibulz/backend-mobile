import { Facilities } from './facilities.entity';
import { Role } from './../role/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsPhoneNumber } from "class-validator";

@Entity()

export class User{
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ unique: true, nullable: false })
    @IsEmail()
    email: string;

    @Column({ nullable: false })
    fullName: string;

    @Column({nullable:true})
    phoneNum : string;


    @Column({ nullable: false })
    password: string;

    @Column({nullable:false, unique:true})
    userNumber : number // NIM / NID / NIStaff

    @Column({
        type:'enum',
        enum : Role,
        default :Role.User
    })
    public role : Role[];

    @Column({nullable:false,default:"other"})
    department : string;

    @OneToMany(()=>Facilities, facilities=>facilities.createdby,{cascade:['insert','update']})
    facilitesCreate : Facilities[];
}   