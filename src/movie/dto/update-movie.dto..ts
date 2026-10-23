import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class UpdateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string
    @IsBoolean()
    isReleased: boolean
}