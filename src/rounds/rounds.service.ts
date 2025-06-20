import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { Round } from './entities/round.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import dayjs from 'dayjs';
import * as process from 'node:process';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RoundsService {
  constructor(
    @InjectRepository(Round)
    private readonly roundsRepository: Repository<Round>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  private enrichDate(round: Round) {
    round['startAt'] = dayjs(round.createdAt).add(
      Number(process.env.COOLDOWN_DURATION),
      'seconds',
    );
    round['finishAt'] = dayjs(round.createdAt).add(
      Number(process.env.COOLDOWN_DURATION) +
      Number(process.env.ROUND_DURATION),
      'seconds',
    );
  }

  async create(request: Request) {
    const { username, isAdmin } = this.authService.getUserFromBearer(
      request.headers.authorization,
    );
    if (!isAdmin) {
      throw new ForbiddenException();
    }
    const user = await this.usersService.getByUserName(username);
    if (!user) {
      throw new ForbiddenException();
    }
    const round = await this.roundsRepository.save({
      users: [user],
    });
    this.enrichDate(round);
    return round;
  }

  async findAll(request: Request) {
    const { username, isAdmin } = this.authService.getUserFromBearer(
      request.headers.authorization,
    );
    if (isAdmin) {
      const rounds = await this.roundsRepository.find();
      rounds.forEach((round) => this.enrichDate(round));
      return rounds;
    }
    const rounds = await this.roundsRepository.find({
      where: {
        users: {
          username,
        },
      },
    });
    rounds.forEach((round) => this.enrichDate(round));
    return rounds;
  }

  async findOne(uuid: string) {
    const round = await this.roundsRepository.findOne({
      where: { uuid },
      relations: ['taps', 'taps.user']
    });
    this.enrichDate(round);
    return round;
  }

  async remove(uuid: string) {
    await this.roundsRepository
      .createQueryBuilder()
      .relation('users')
      .of(uuid)
      .remove(await this.usersRepository.find());
    return this.roundsRepository.delete({ uuid });
  }
}
