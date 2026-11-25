import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/types/task';

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; variant: 'secondary' | 'default' | 'outline'; className: string }
> = {
  [TaskStatus.TODO]: {
    label: 'To Do',
    variant: 'secondary',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    variant: 'outline',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
