import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  Verification,
  VerificationStatus,
} from './entities/verification.entity';
import { User } from '../users/entities/user.entity';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private verificationRepo: Repository<Verification>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // SUBMIT (User uploads docs)
  async submit(submitDto: SubmitVerificationDto, user: User) {
    // Check if user already has a pending or approved verification
    const existing = await this.verificationRepo.findOne({
      where: { user: { id: user.id } },
      order: { submittedAt: 'DESC' },
    });

    if (existing && existing.status === VerificationStatus.PENDING) {
      throw new BadRequestException(
        'You already have a verification request pending review.',
      );
    }
    if (existing && existing.status === VerificationStatus.APPROVED) {
      throw new BadRequestException('Account already verified.');
    }

    const verification = this.verificationRepo.create({
      ...submitDto,
      user: user,
      status: VerificationStatus.PENDING,
    });

    return this.verificationRepo.save(verification);
  }

  //  REVIEW (Admin only)
  async review(
    verificationId: string,
    status: VerificationStatus.APPROVED | VerificationStatus.REJECTED,
    adminId: string,
    comments?: string, // This is optional (undefined)
  ) {
    const verification = await this.verificationRepo.findOne({
      where: { id: verificationId },
      relations: ['user'],
    });

    if (!verification)
      throw new NotFoundException('Verification request not found');

    verification.status = status;
    verification.verifiedByAdminId = adminId;

    // FIX: If comments is undefined, save null to the database
    verification.adminComments = comments || null;

    await this.verificationRepo.save(verification);

    if (status === VerificationStatus.APPROVED) {
      const user = verification.user;
      user.isVerified = true;
      await this.userRepo.save(user);
    }

    return verification;
  }

  //  GET PENDING (For Admin Dashboard)
  async findPending() {
    return this.verificationRepo.find({
      where: { status: VerificationStatus.PENDING },
      relations: ['user'],
      order: { submittedAt: 'ASC' },
    });
  }
}
