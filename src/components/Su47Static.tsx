import payload from "@/data/su47-static.json";

type Payload = {
  meta: {
    grid: [number, number];
    charAspect: number;
    ink: string;
    source: string;
    subject: string;
    view: string;
  };
  rows: string[];
};

const data = payload as unknown as Payload;

/**
 * The hero aircraft: the Su-47 reference photograph with its background removed
 * (an alpha matte from a segmentation model), cropped tight to the airframe and
 * converted to characters. One ink on paper — no palette, no coloured fills.
 * Regenerate with scripts/render-su47-static.py.
 */
export function Su47Static({ className }: { className?: string }) {
  return (
    <div className={`relative select-none ${className ?? ""}`} aria-hidden="true">
      <pre
        className="ascii mx-auto"
        style={{
          fontSize: "clamp(2.6px, min(0.63vw, 0.46vh), 8px)",
          lineHeight: 1,
          color: data.meta.ink,
        }}
      >
        {data.rows.join("\n")}
      </pre>
    </div>
  );
}
