import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentType } from '../entities/payment.entity';

export class InitiatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string; // The M-Pesa number to charge

  @IsEnum(PaymentType)
  @IsNotEmpty()
  type: PaymentType;

  // Context: What are they paying for?
  @IsUUID()
  @IsOptional()
  parcelId?: string; // If buying a specific plot

  @IsString()
  @IsOptional()
  subscriptionTier?: 'BRONZE' | 'DIAMOND' | 'GOLD'; // If buying a session
}
