import { Injectable, NotFoundException } from "@nestjs/common";
import { Tap } from "./entity/tap.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class TapsService {
    constructor(
        @InjectRepository(Tap)
        private readonly tapsRepository: Repository<Tap>,
        private readonly authService: AuthService
    ) { }

    async create(uuid: string, request: Request) {
        const { username } = this.authService.getUserFromBearer(
            request.headers.authorization,
        );

        if (!username) {
            throw new NotFoundException('User not found');
        }

        try {
            return await this.tapsRepository.save({ user: { username }, round: { uuid } })
        } catch (error) {
            return this.tapsRepository.findOneBy({
                user: { username },
                round: { uuid },
            });
        }
    }

    async click({ username, round_uuid }: { username: string, round_uuid: string }) {
        await this.tapsRepository.increment({ user: { username }, round: { uuid: round_uuid } }, 'count', 1)
        return this.tapsRepository.findOneBy({ user: { username }, round: { uuid: round_uuid } })
    }

    async findOne(uuid: string, request: Request) {
        const { username } = this.authService.getUserFromBearer(
            request.headers.authorization,
        );
        return this.tapsRepository.findOne({
            where: {
                round: { uuid },
                user: { username }
            },
        })
    }
}