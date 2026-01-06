import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { VerificationStatus } from './entities/verification.entity';
import { RolesGuard } from 'src/ common/guards/roles.guard';
import { CurrentUser } from 'src/ common/decorators/current-user.decorator';
import { Roles } from 'src/ common/decorators/roles.decorator';

@Controller('verifications')
@UseGuards(JwtAuthGuard) // All routes require login
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  // User: Submit Docs
  @Post('submit')
  submit(@Body() dto: SubmitVerificationDto, @CurrentUser() user: User) {
    return this.verificationsService.submit(dto, user);
  }

  // Admin: Get all pending requests
  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getPending() {
    return this.verificationsService.findPending();
  }

  // Admin: Approve/Reject
  @Patch(':id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  review(
    @Param('id') id: string,
    @Body('status')
    status: VerificationStatus.APPROVED | VerificationStatus.REJECTED,
    @Body('comments') comments: string,
    @CurrentUser() admin: User,
  ) {
    return this.verificationsService.review(id, status, admin.id, comments);
  }
}
