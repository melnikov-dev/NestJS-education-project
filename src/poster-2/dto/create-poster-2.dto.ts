import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePoster2Dto {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;

  @IsInt()
  movieId: number;
}
