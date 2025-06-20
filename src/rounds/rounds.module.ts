import { Module } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './entities/round.entity';
import { Tap } from '../taps/entity/tap.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Round, Tap, User])],
  controllers: [RoundsController],
  providers: [RoundsService, AuthService, UsersService],
})
export class RoundsModule {}
