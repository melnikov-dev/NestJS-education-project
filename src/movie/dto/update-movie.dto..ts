import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { Genre } from "../entities/movie.entity.js"

export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    @MaxLength(128)
    title: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsNumber()
    rating: number

    @IsOptional()
    @IsEnum(Genre)
    ganre: Genre

    @IsOptional()
    @IsBoolean()
    isReleazed: boolean
}
