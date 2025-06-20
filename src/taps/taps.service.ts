import { Injectable, NotFoundException } from "@nestjs/common";
import { Tap } from "./entity/tap.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RoundsService } from "src/rounds/rounds.service";
import { UsersService } from "src/users/users.service";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class TapsService {
    constructor(
        @InjectRepository(Tap)
        private readonly tapsRepository: Repository<Tap>,
        private readonly roundsService: RoundsService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) { }

    async click(username: string, round_uuid: string) {
        const round = await this.roundsService.findOne(round_uuid);
        if (!round) {
            throw new NotFoundException('Round not found');
        }
        let tap = await this.tapsRepository.findOne({
            where: {
                round: { uuid: round_uuid },
                user: { username },
            },
        });
        if (!tap) {
            const user = await this.usersService.getByUserName(username)
            if (!user || !round) {
                throw new NotFoundException('Round or User not found');
            }
            tap = this.tapsRepository.create({ user, round })
            await this.tapsRepository.save(tap)
        }
        await this.tapsRepository.increment({ id: tap.id }, 'count', 1)
        tap.count ++
        return tap;
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