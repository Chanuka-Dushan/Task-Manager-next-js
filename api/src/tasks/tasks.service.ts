import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: randomUUID(),
      title: 'Set up NestJS backend',
      description: 'Create TasksModule, DTO validation, and in-memory store.',
      status: TaskStatus.DONE,
      dueDate: '2026-11-26',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Build Next.js task table',
      description: 'Render tasks with status badges and edit/delete actions.',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2026-11-28',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Write README and verify setup',
      description: 'Document setup steps, decisions, and example curl requests.',
      status: TaskStatus.TODO,
      dueDate: '2026-11-30',
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(): Task[] {
    return [...this.tasks].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  findOne(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status ?? TaskStatus.TODO,
      dueDate: createTaskDto.dueDate,
      createdAt: new Date().toISOString(),
    };
    this.tasks.unshift(task);
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
  }

  remove(id: string): void {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    this.tasks.splice(index, 1);
  }
}
