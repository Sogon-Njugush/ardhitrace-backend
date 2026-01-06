import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.verifications)
  user: User;

  @Column({ nullable: true })
  idDocumentUrl: string;

  @Column({ nullable: true })
  idDocumentBackUrl: string;

  @Column({ nullable: true })
  kraPinUrl: string;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  // --- FIX START ---
  // Explicitly tell Postgres this is 'text' to avoid the "Object" error
  @Column({ type: 'text', nullable: true })
  adminComments: string | null;

  // Explicitly tell Postgres this is a 'uuid' (since User IDs are UUIDs)
  @Column({ type: 'uuid', nullable: true })
  verifiedByAdminId: string | null;
  // --- FIX END ---

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  reviewedAt: Date;
}
