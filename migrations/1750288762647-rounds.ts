import { MigrationInterface, QueryRunner } from "typeorm";

export class Rounds1750288762647 implements MigrationInterface {
    name = 'Rounds1750288762647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rounds" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e23c46934eea0510820d3593ffa" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "taps" ("id" SERIAL NOT NULL, "count" integer NOT NULL DEFAULT '0', "userUsername" character varying, "roundUuid" uuid, CONSTRAINT "PK_0041c5d5b2eebef4f8881ffa3f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "isAdmin" boolean NOT NULL, CONSTRAINT "PK_fe0bb3f6520ee0469504521e710" PRIMARY KEY ("username"))`);
        await queryRunner.query(`CREATE TABLE "users_rounds_rounds" ("usersUsername" character varying NOT NULL, "roundsUuid" uuid NOT NULL, CONSTRAINT "PK_0fca6d0dbc633f2a8e6c31625c1" PRIMARY KEY ("usersUsername", "roundsUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8f91a03277b5931f27ac641236" ON "users_rounds_rounds" ("usersUsername") `);
        await queryRunner.query(`CREATE INDEX "IDX_aef2f6aae958ab6bba620bfc34" ON "users_rounds_rounds" ("roundsUuid") `);
        await queryRunner.query(`ALTER TABLE "taps" ADD CONSTRAINT "FK_3abd5a5b6ee192bf14becf87e1a" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taps" ADD CONSTRAINT "FK_68ba4fb2b50f37037e722e74bdc" FOREIGN KEY ("roundUuid") REFERENCES "rounds"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_rounds_rounds" ADD CONSTRAINT "FK_8f91a03277b5931f27ac641236a" FOREIGN KEY ("usersUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_rounds_rounds" ADD CONSTRAINT "FK_aef2f6aae958ab6bba620bfc34e" FOREIGN KEY ("roundsUuid") REFERENCES "rounds"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_rounds_rounds" DROP CONSTRAINT "FK_aef2f6aae958ab6bba620bfc34e"`);
        await queryRunner.query(`ALTER TABLE "users_rounds_rounds" DROP CONSTRAINT "FK_8f91a03277b5931f27ac641236a"`);
        await queryRunner.query(`ALTER TABLE "taps" DROP CONSTRAINT "FK_68ba4fb2b50f37037e722e74bdc"`);
        await queryRunner.query(`ALTER TABLE "taps" DROP CONSTRAINT "FK_3abd5a5b6ee192bf14becf87e1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aef2f6aae958ab6bba620bfc34"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f91a03277b5931f27ac641236"`);
        await queryRunner.query(`DROP TABLE "users_rounds_rounds"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "taps"`);
        await queryRunner.query(`DROP TABLE "rounds"`);
    }

}
