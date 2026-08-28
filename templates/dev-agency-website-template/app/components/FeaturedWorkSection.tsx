import type { AgencyFeaturedWork } from "@prisma/client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/constants";
import { WORK_GRADIENTS } from "@/lib/agency/gradients";

function WorkCard({ item }: { item: AgencyFeaturedWork }) {
  const gradient = WORK_GRADIENTS[item.gradient] ?? WORK_GRADIENTS.purple;

  return (
    <article
      className={`flex-shrink-0 w-[280px] md:w-[320px] h-[200px] rounded-2xl border border-white/10 bg-gradient-to-br ${gradient} p-6 flex flex-col justify-between`}
    >
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 px-2 py-1 rounded-full bg-black/20">
          {item.category}
        </span>
        <h3 className="mt-4 text-lg font-bold text-white">{item.clientName}</h3>
        {item.review && (
          <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">{item.review}</p>
        )}
      </div>
      <Link
        href={item.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mt-4"
      >
        Visit website <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}

export default function FeaturedWorkSection({ items }: { items: AgencyFeaturedWork[] }) {
  const section = SITE.agency.work;
  const loop = [...items, ...items];

  return (
    <section id="work" className="py-24 px-6 border-t border-primary/10 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main">
          {section.title}{" "}
          <span className="bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent">
            {section.titleAccent}
          </span>
        </h2>
        <p className="mt-3 text-text-muted max-w-2xl">{section.subtitle}</p>
      </div>

      <div className="relative">
        <div className="flex gap-6 animate-agency-marquee hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <WorkCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
