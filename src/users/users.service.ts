import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  private readonly saltOrRounds = 10;

  async getByUserName(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async get({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<User & { token: string }> {
    let user = await this.usersRepository.findOne({
      where: { username },
      select: ['username', 'passwordHash', 'isAdmin']
    });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('incorrect password');
      }
    } else {
      const isAdmin = username === process.env.ADMIN_USERNAME;
      const passwordHash = await bcrypt.hash(password, this.saltOrRounds);
      user = await this.usersRepository.save({
        username,
        passwordHash,
        isAdmin,
      });
    }
    const token = await this.authService.generateJwt({
      username,
      isAdmin: user.isAdmin,
    });
    return { ...user, token };
  }
}
