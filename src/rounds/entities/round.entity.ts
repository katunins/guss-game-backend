import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tap } from '../../taps/entity/tap.entity';
import { User } from '../../users/entities/user.entity';

@Entity('rounds')
export class Round {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Tap, (tap) => tap.round)
  taps: Tap[];

  @ManyToMany(() => User, (user) => user.rounds)
  users: User[];
}
