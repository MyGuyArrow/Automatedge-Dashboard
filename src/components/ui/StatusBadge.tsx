export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-bg px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-fg" />
      {status.replaceAll('_', ' ')}
    </span>
  );
}
