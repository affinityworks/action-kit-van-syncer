import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnsToUserAndCreatePhone1528838191301 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "phone" ("id" SERIAL NOT NULL, "vanId" integer, "akId" integer NOT NULL, "number" character varying NOT NULL, "type" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f35e6ee6c1232ce6462505c2b25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "vanId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "akId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "phone" ADD CONSTRAINT "FK_260d7031e6bd9ed4fbcd2dd3ad6" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "phone" DROP CONSTRAINT "FK_260d7031e6bd9ed4fbcd2dd3ad6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "akId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "vanId"`);
        await queryRunner.query(`DROP TABLE "phone"`);
    }

}
