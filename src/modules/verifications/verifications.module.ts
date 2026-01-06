import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Import this
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';
import { Verification } from './entities/verification.entity'; // <--- Import Entity
import { User } from '../users/entities/user.entity'; // <--- Import User Entity

@Module({
  // FIX: Register both entities so the Service can inject their repositories
  imports: [TypeOrmModule.forFeature([Verification, User])],
  controllers: [VerificationsController],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
