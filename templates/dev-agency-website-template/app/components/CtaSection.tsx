import { SITE } from "@/constants";

export default function CtaSection({
  onOpenEnquiry,
}: {
  onOpenEnquiry: (label?: string) => void;
}) {
  const cta = SITE.agency.cta;

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-900/50 p-10 md:p-14 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          {cta.title}{" "}
          <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {cta.titleAccent}
          </span>
        </h2>
        <p className="mt-4 text-slate-400 max-w-xl mx-auto leading-relaxed">{cta.subtitle}</p>
        <button
          type="button"
          onClick={() => onOpenEnquiry(cta.buttonLabel)}
          className="mt-8 px-8 py-3 rounded-full bg-white text-slate-950 font-bold text-sm shadow-[0_0_24px_rgba(255,255,255,0.25)] hover:scale-[1.02] transition-transform cursor-pointer"
        >
          {cta.buttonLabel}
        </button>
      </div>
    </section>
  );
}
