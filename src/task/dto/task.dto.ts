import { ApiProperty } from "@nestjs/swagger";

export class TaskResponseDto {
    @ApiProperty({
        description: 'ID задачи',
        example: '1',
        type: String
    })
    id: string;
    @ApiProperty({
        description: 'Название задачи',
        example: 'Learn NestJS',
        type: String
    })
    title: string;
    @ApiProperty({
        description: 'Статус задачи',
        example: true,
        type: Boolean
    })
    isCompleted: boolean;
}