export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="ae-panel rounded-lg p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-normal text-fg">{value}</p>
      {helper ? <p className="mt-2 text-xs text-muted">{helper}</p> : null}
    </div>
  );
}
