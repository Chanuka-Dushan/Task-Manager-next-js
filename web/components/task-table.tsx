import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/status-badge';
import { Task } from '@/types/task';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-base font-medium text-muted-foreground">
          No tasks yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Click &ldquo;New task&rdquo; to create your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[140px]">Status</TableHead>
            <TableHead className="w-[130px]">Due Date</TableHead>
            <TableHead className="w-[160px]">Created At</TableHead>
            <TableHead className="w-[160px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-md truncate text-muted-foreground">
                {task.description || '-'}
              </TableCell>
              <TableCell>
                <StatusBadge status={task.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.dueDate ? task.dueDate.slice(0, 10) : '-'}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(task.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(task)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
