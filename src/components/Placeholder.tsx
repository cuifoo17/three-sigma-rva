// Slots for art and copy that don't exist yet. Visibly provisional on purpose.

type ArtProps = {
  label: string;
  ratio?: "video" | "square" | "portrait";
  className?: string;
};

const ratios = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export function ArtSlot({ label, ratio = "video", className = "" }: ArtProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder for ${label}`}
      className={`flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-accent bg-accent/30 ${ratios[ratio]} ${className}`}
    >
      <span className="px-3 text-center text-xs font-bold uppercase tracking-widest opacity-50">
        {label}
      </span>
    </div>
  );
}

export function PendingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`rounded bg-yellow/40 px-1 italic opacity-70 ${className}`}>
      [{text}]
    </span>
  );
}
