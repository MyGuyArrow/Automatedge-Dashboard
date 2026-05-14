import { clsx } from 'clsx';

const toneByStatus = {
  INTAKE_PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
  AWAITING_ASSETS: 'bg-orange-50 text-orange-800 ring-orange-200',
  AWAITING_ACCESS: 'bg-rose-50 text-rose-800 ring-rose-200',
  IN_BUILD: 'bg-blue-50 text-blue-800 ring-blue-200',
  QA_REVIEW: 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  LIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  PAUSED: 'bg-slate-100 text-slate-700 ring-slate-200',
  COMPLETE: 'bg-teal-50 text-teal-800 ring-teal-200',
  TODO: 'bg-slate-100 text-slate-700 ring-slate-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-800 ring-blue-200',
  BLOCKED: 'bg-red-50 text-red-800 ring-red-200',
  DONE: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-500 ring-slate-200',
  DRAFT: 'bg-amber-50 text-amber-800 ring-amber-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  ARCHIVED: 'bg-slate-100 text-slate-500 ring-slate-200',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset',
        toneByStatus[status as keyof typeof toneByStatus] ||
          'bg-slate-100 text-slate-700 ring-slate-200',
      )}
    >
      {status.replaceAll('_', ' ')}
    </span>
  );
}
