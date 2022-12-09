import { Role } from './../role/role.enum';
import { User } from './../entities/user.entity';
import { MigrationInterface, QueryRunner } from "typeorm"

export class PostRefactoring1670570778501 implements MigrationInterface {

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
        await queryRunner.query('DELETE * FROM user')
    }

}
