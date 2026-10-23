import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from "class-validator"
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

    @IsArray()
    @IsInt({ each: true })
    actorIds: number[]

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    imageUrl: string
}
