import {MigrationInterface, QueryRunner} from "typeorm"

export class AddUser1528487573935 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "firstName" character varying NOT NULL, 
        "lastName" character varying NOT NULL, 
        "age" integer NOT NULL, 
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )`,
    )
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "user"`)
  }

}
