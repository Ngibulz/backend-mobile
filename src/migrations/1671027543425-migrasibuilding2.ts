import { BuidlingEnum } from './../role/building.enum';
import { Building } from './../entities/building.entity';
import { MigrationInterface, QueryRunner } from "typeorm"

export class migrasibuilding21671027543425 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const GBP1 = await queryRunner.manager.save(
            queryRunner.manager.create<Building>(Building,{
                buildingName:[BuidlingEnum.a],
                description:"Gedung A memiliki jumlah lantai 8, yang seluruh lantainya dipergunakan sebagai gedung Rektorat serta kantor prodi dan departement yang ada di UMN serta terdapat Function Hall."
            })
        )
        const GBP2 = await queryRunner.manager.save(
            queryRunner.manager.create<Building>(Building,{
                buildingName:[BuidlingEnum.b],
                description:"Gedung B menjadi area lobby utama dengan memiliki 5 lantai, yang dipergunakan sebagai perpustakaan, ruang kelas, dan laboratorium serta beberapa ruangan media kampus."
            })
        )
        const GBP3 = await queryRunner.manager.save(
            queryRunner.manager.create<Building>(Building,{
                buildingName:[BuidlingEnum.c],
                description:`Gedung C atau New Media Tower memiliki 12 lantai dan 1 basement, dipergunakan sebagai ruang kelas, basement dipergunakan sebagai gedung parkir kendaraan roda 2, lantai 1 dipergunakan untuk kantin, lantai 12 dipergunakan sebagai gedung “Business Incubator" dan terdapat Lecture Hall di lantai 3.`
            })
        )
        const GBP4 = await queryRunner.manager.save(
            queryRunner.manager.create<Building>(Building,{
                buildingName:[BuidlingEnum.d],
                description:"Gedung D atau PK. Ojong – Jacob Oetama dengan total 23 lantai dan 1 basement, yang dipergunakan sebagai ruang kelas dan laboratorium, basement dipergunakan sebagai tempat parkir mobil, lantai 1 dipergunakan sebagai pusat kegiatan mahasiswa dan terdapat Lecture Theater serta lantai 23 dipergunakan sebagai sarana berolah raga."
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
