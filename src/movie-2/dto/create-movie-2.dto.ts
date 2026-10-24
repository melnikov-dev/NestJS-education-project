import { Genre2 } from '@prisma/client';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateMovie2Dto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  title: string;

  @IsOptional()
  @IsNotEmpty()
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

  @IsArray()
  @IsInt({ each: true })
  actorIds: number[];

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  imageUrl: string;
}
