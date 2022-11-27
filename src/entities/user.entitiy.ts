import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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

    @Column({nullable:false})
    userNumber : string // NIM / NID / NIStaff
}