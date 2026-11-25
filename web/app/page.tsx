'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DeleteTaskDialog } from '@/components/delete-task-dialog';
import { TaskFormDialog } from '@/components/task-form-dialog';
import { TaskTable } from '@/components/task-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { CreateTaskInput, Task } from '@/types/task';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  async function handleRetry() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'Failed to load tasks.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Failed to load tasks.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleOpenCreate() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function handleOpenEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: CreateTaskInput) {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, data);
        setTasks((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        toast.success('Task updated');
      } else {
        const created = await createTask(data);
        setTasks((prev) => [created, ...prev]);
        toast.success('Task created');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save task.');
      throw err;
    }
  }

  async function handleConfirmDelete(task: Task) {
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((item) => item.id !== task.id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete task.',
      );
      throw err;
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-sm text-muted-foreground">
            Create, track, and manage your tasks.
          </p>
        </div>
        <Button onClick={handleOpenCreate}>New task</Button>
      </div>

      {loading ? (
        <div className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : loadError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="font-medium text-destructive">Failed to load tasks</p>
          <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => void handleRetry()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleOpenEdit}
          onDelete={(task) => setDeletingTask(task)}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onOpenChange={(open) => {
          if (!open) setDeletingTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </main>
  );
}
