import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SubmitVerificationDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'ID Document must be a valid URL' })
  idDocumentUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  idDocumentBackUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  kraPinUrl: string;
}
