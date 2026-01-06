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

  // Documents stored in Supabase Storage / S3
  @Column({ nullable: true })
  idDocumentUrl: string; // National ID Front

  @Column({ nullable: true })
  idDocumentBackUrl: string; // National ID Back

  @Column({ nullable: true })
  kraPinUrl: string; // Optional: Tax PIN

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ nullable: true })
  adminComments: string; // Why it was rejected

  @Column({ nullable: true })
  verifiedByAdminId: string; // ID of the Admin who approved it

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  reviewedAt: Date;
}
