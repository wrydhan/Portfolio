import payload from "@/data/su47-static.json";

type Payload = {
  meta: { grid: [number, number]; charAspect: number; palette: Record<string, string> };
  rows: [string, string][];
};

const data = payload as unknown as Payload;

/**
 * The hero aircraft: one static, coloured ASCII plot of the Su-47, drawn from a
 * symmetric planform mask (see scripts/render-su47-static.py).
 *
 * Nothing animates here on purpose. The turntable route is kept in
 * Su47Ascii.tsx for later, but frames are not shipped until this plot is right.
 */
export function Su47Static({ className }: { className?: string }) {
  const { palette } = data.meta;

  return (
    <div className={`relative select-none ${className ?? ""}`} aria-hidden="true">
      <pre
        className="ascii mx-auto"
        style={{ fontSize: "clamp(3px, min(0.72vw, 0.52vh), 9px)", lineHeight: 1 }}
      >
        {data.rows.map(([chars, runs], rowIndex) => {
          const spans: React.ReactNode[] = [];
          let cursor = 0;
          for (const run of runs.split(",")) {
            const [colourIndex, count] = run.split(":");
            const length = Number(count) || 0;
            const text = chars.slice(cursor, cursor + length);
            cursor += length;
            if (colourIndex === "-1" || text.trim() === "") {
              spans.push(text);
              continue;
            }
            spans.push(
              <span key={`${rowIndex}-${cursor}`} style={{ color: palette[colourIndex] }}>
                {text}
              </span>,
            );
          }
          return (
            <span key={rowIndex}>
              {spans}
              {"\n"}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
