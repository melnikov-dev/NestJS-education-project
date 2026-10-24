import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReview2Dto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;

  @IsNumber()
  movieId: number;
}
