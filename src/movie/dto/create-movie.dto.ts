import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string
    @IsBoolean()
    isReleased: boolean
}