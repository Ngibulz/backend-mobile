import { User } from './../entities/user.entity';
import { Role } from './../role/role.enum';
import { MigrationInterface, QueryRunner } from "typeorm"

export class migrasi11670572558294 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.manager.create<User>(User,{
            email:"williamtestmigrate123@gmail.com",
            password:"$2a$10$3pGLLL.gWsykDZAszKtSUOiDFyAXDPXgYFRkm/4cKfj55t/3XcdVS",
            fullName:'williams Mastah',
            role:[Role.Admin],
            phoneNum:"081222374543",
            userNumber:"4236324",
            department:"Teknik Informatika"
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
