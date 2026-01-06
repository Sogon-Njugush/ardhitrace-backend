import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParcelType } from '../entities/parcel.entity';

// 1. Helper DTO for GeoJSON Geometry
class GeoJSONDto {
  @IsString()
  @IsEnum(['Point', 'Polygon'], {
    message: 'Location type must be Point or Polygon',
  })
  type: 'Point' | 'Polygon';

  @IsNotEmpty()
  // We allow array of numbers (Point) or array of array of arrays (Polygon)
  coordinates: number[] | number[][][];
}

export class CreateParcelDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  titleNumber?: string; // Optional during draft/upload

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  areaInAcres: number;

  @IsEnum(ParcelType)
  @IsOptional()
  type?: ParcelType; // Defaults to STANDALONE if empty

  // 2. Validate the Spatial Data
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONDto)
  location: GeoJSONDto;
}
