type Props = {
  index: string;
  label: string;
  title: string;
  note?: string;
};

export function SectionHead({ index, label, title, note }: Props) {
  return (
    <div className="mb-12 grid gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-10">
      <p className="label flex items-baseline gap-3 text-mute">
        <span className="text-ink">{index}</span>
        {label}
      </p>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="display text-[clamp(2.1rem,4.6vw,3.9rem)]">{title}</h2>
        {note && <p className="max-w-xs text-[13px] leading-snug text-mute md:pb-2">{note}</p>}
      </div>
    </div>
  );
}
