import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdateTaskDto {
    @IsNotEmpty({ message: 'title задачи не должно быть пустым' })
    @IsString({ message: 'title задачи должно быть строкой' })
    @Length(2, 40, { message: 'title задачи должно быть от 2 до 40 символов' })
    title: string;
    @IsBoolean()
    isCompleted: boolean;
}