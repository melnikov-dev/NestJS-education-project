import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task.dto.js';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation({
    summary: 'Получить список задач',
    description: 'Возвращает список существующих задач'
  })
  @ApiOkResponse({
    description: 'Возвращает список существующих задач',
    type: [TaskResponseDto],
  })
  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @ApiOperation({
    summary: 'Получить задачу по id',
    description: 'Возвращает задачу по id'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'id задачи'
  })
  @ApiOkResponse({
    description: 'Возвращает задачу по id',
    type: TaskResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Задача не найдена'
  })
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.taskService.getById(Number(id));
  }

  @ApiOperation({
    summary: 'Создать новую задачу',
  })
  @ApiOkResponse({
    description: 'Возвращает созданную задачу'
  })
  @ApiBadRequestResponse({
    description: 'Невалидное тело запроса'
  })
  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(Number(id), dto);
  }

  @Patch('/:id')
  patch(@Param('id') id: string, @Body() dto: Partial<UpdateTaskDto>) {
    return this.taskService.patch(Number(id), dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.taskService.delete(Number(id));
  }
}
