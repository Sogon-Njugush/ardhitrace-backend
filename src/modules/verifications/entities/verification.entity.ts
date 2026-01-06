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

  // FIX: Allow 'null' for nullable database columns
  @Column({ nullable: true })
  adminComments: string | null;

  // FIX: Allow 'null' here too
  @Column({ nullable: true })
  verifiedByAdminId: string | null;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  reviewedAt: Date;
}
