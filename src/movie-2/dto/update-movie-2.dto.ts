import { Genre2 } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateMovie2Dto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsEnum(Genre2)
  ganre?: Genre2;

  @IsOptional()
  @IsBoolean()
  isReleazed?: boolean;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;
}
