import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PaymentType {
  BUYER_SESSION_FEE = 'BUYER_SESSION_FEE', // e.g. Bronze Tier Access
  SELLER_LISTING_FEE = 'SELLER_LISTING_FEE', // e.g. GIS Unlock fee
  VERIFICATION_FEE = 'VERIFICATION_FEE', // e.g. Search fee
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mpesaCheckoutRequestId: string; // Unique ID from Safaricom

  @Column({ nullable: true })
  mpesaReceiptNumber: string; // e.g., QKH1234567

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  phoneNumber: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Stores extra context (e.g., which Listing ID was paid for)

  @CreateDateColumn()
  createdAt: Date;
}
