import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.taskService.getById(Number(id));
  }

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
