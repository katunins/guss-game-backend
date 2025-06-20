import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Round } from '../../rounds/entities/round.entity';

@Entity('taps')
export class Tap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  count: number;

  @ManyToOne(() => User, (user) => user.taps, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Round, (round) => round.taps, { onDelete: 'CASCADE' })
  round: Round;
}
