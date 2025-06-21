import { MigrationInterface, QueryRunner } from "typeorm";

export class UnqueTaps1750508213159 implements MigrationInterface {
    name = 'UnqueTaps1750508213159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taps" ADD CONSTRAINT "UQ_23ccd173fa731a60997ff3e26c3" UNIQUE ("userUsername", "roundUuid")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taps" DROP CONSTRAINT "UQ_23ccd173fa731a60997ff3e26c3"`);
    }

}
