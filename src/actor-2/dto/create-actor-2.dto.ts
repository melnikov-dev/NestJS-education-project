import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActor2Dto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
