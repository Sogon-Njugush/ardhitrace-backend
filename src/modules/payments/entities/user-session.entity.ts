import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AccessTier {
  BRONZE = 'BRONZE', // < 50 Acres viewing
  DIAMOND = 'DIAMOND', // 50-200 Acres viewing
  GOLD = 'GOLD', // > 200 Acres
}

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column({ type: 'enum', enum: AccessTier })
  tier: AccessTier;

  @CreateDateColumn()
  activeFrom: Date;

  @Column()
  expiresAt: Date; // e.g., 24 hours after payment

  @Column({ default: true })
  isActive: boolean;
}
