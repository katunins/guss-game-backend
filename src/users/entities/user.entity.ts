import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Tap } from '../../taps/entity/tap.entity';
import { Round } from '../../rounds/entities/round.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(() => Tap, (tap) => tap.user)
  taps: Tap[];

  @ManyToMany(() => Round, (round) => round.users)
  @JoinTable()
  rounds: Round[];
}
