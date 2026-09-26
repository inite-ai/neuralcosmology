import Image from "next/image";
import { cn } from "@/lib/utils";

// «Пластина»: изображение в 0.5px-рамке с моно-подписью, как архивная
// астрономическая пластинка. Кадры лежат в public/media (assets-src/manifest.json).

export type PlateId = "hero-web" | "neurons" | "plate-galaxy" | "landauer" | "observatory" | "bioelectric";

const PLATES: Record<PlateId, { w: number; h: number; alt: string }> = {
  "hero-web": { w: 2000, h: 1333, alt: "Cosmic web filaments resembling neural tissue" },
  neurons: { w: 2000, h: 1333, alt: "Cortical neurons, confocal micrograph" },
  "plate-galaxy": { w: 1333, h: 2000, alt: "Spiral galaxy on an archival glass plate" },
  landauer: { w: 2000, h: 1333, alt: "Superconducting chip inside a dilution refrigerator" },
  observatory: { w: 2000, h: 1333, alt: "Observatory dome open to the Milky Way" },
  bioelectric: { w: 2000, h: 1333, alt: "Bioelectric pre-pattern in an early embryo" },
};

export default function Plate({
  id,
  caption,
  index,
  className,
  imgClassName,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  fill,
}: {
  id: PlateId;
  caption?: string;
  index?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Заполнить родителя (родитель задаёт размер и relative). */
  fill?: boolean;
}) {
  const p = PLATES[id];
  return (
    <figure className={cn("relative overflow-hidden bg-bg-sunk", className)}>
      {fill ? (
        <Image
          src={`/media/${id}.jpg`}
          alt={p.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <Image
          src={`/media/${id}.jpg`}
          alt={p.alt}
          width={p.w}
          height={p.h}
          sizes={sizes}
          priority={priority}
          className={cn("h-auto w-full", imgClassName)}
        />
      )}
      {(caption || index) && (
        <figcaption className="pointer-events-none absolute bottom-0 left-0 flex gap-3 px-4 py-3 label text-fg/70">
          {index && <span className="text-primary">{index}</span>}
          {caption && <span>{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
