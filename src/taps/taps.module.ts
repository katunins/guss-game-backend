import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tap } from './entity/tap.entity';
import { TapsService } from './taps.service';
import { Round } from 'src/rounds/entities/round.entity';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { TapsController } from './taps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tap, Round, User])],
  controllers: [TapsController],
  providers: [TapsService, AuthService],
  exports: [TapsService]
})
export class TapsModule {}
