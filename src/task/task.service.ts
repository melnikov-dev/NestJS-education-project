import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService {

    private tasks = [
        { id: 1, title: 'Task: learn express', isCompleted: true },
        { id: 2, title: 'Task: learn nest', isCompleted: false },
    ]

    getAll() {
        return this.tasks;
    }

    getById(id: number) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new NotFoundException('Task not found')
        }
        return task
    }

    create(dto: CreateTaskDto) {
        const { title } = dto;
        const newTask = {
            id: this.tasks.length + 1,
            title,
            isCompleted: false,
        }

        this.tasks.push(newTask);

        return true;
    }

    update(id: number, dto: UpdateTaskDto) {
        const task = this.getById(id);

        if (!task) {
            throw new NotFoundException('Task not found')
        }

        const { title, isCompleted } = dto;
        task.title = title;
        task.isCompleted = isCompleted;

        return true;
    }

    patch(id: number, dto: Partial<UpdateTaskDto>) {
        const task = this.getById(id);

        if (!task) {
            throw new NotFoundException('Task not found')
        }

        Object.assign(task, dto);

        return true;
    }

    delete(id: number) {
        const task = this.getById(id);

        if (!task) {
            throw new NotFoundException('Task not found')
        }

        this.tasks = this.tasks.filter((t) => t.id !== task.id)

        return true
    }
}
