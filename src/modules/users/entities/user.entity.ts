import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Parcel } from '../../parcels/entities/parcel.entity';
import { Transaction } from 'src/modules/payments/entities/payment.entity';
import { UserSession } from 'src/modules/payments/entities/user-session.entity';
import { Verification } from 'src/modules/verifications/entities/verification.entity';

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT', // For B2B Gold Tier
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string; // Essential for M-Pesa

  @Column({ select: false }) // Hide password by default
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ default: false })
  isVerified: boolean; // True if Verification entity is approved

  // RELATIONSHIPS
  @OneToMany(() => Parcel, (parcel) => parcel.seller)
  listings: Parcel[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Verification, (verification) => verification.user)
  verifications: Verification[];

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
