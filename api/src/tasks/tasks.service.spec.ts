import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    service = new TasksService();
  });

  it('should create a task with default status TODO', () => {
    const created = service.create({
      title: 'Test task',
      description: 'Test description',
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Test task');
    expect(created.description).toBe('Test description');
    expect(created.status).toBe(TaskStatus.TODO);
    expect(created.createdAt).toBeDefined();
  });

  it('should throw NotFoundException when task is not found', () => {
    expect(() => service.findOne('does-not-exist')).toThrow(NotFoundException);
  });

  it('should update an existing task', () => {
    const created = service.create({ title: 'Initial title' });
    const updated = service.update(created.id, {
      title: 'Updated title',
      status: TaskStatus.IN_PROGRESS,
    });

    expect(updated.title).toBe('Updated title');
    expect(updated.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('should remove an existing task', () => {
    const created = service.create({ title: 'Task to delete' });
    service.remove(created.id);

    expect(() => service.findOne(created.id)).toThrow(NotFoundException);
  });
});
