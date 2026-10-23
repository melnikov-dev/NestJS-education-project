import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { Genre } from "../entities/movie.entity.js"

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(128)
    title: string

    @IsOptional()
    @IsNotEmpty()
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
