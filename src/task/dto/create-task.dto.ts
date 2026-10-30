import { IsNotEmpty, IsString, Length } from 'class-validator'
import { StartsWith } from '../decorators/start-with.decorator.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        description: 'Название',
        example: 'Learn NestJS',
        type: String,
    })
    @IsNotEmpty({ message: 'title задачи не должно быть пустым' })
    @IsString({ message: 'title задачи должно быть строкой' })
    @Length(2, 40, { message: 'title задачи должно быть от 2 до 40 символов' })
    @StartsWith('Task:')
    title: string;
}