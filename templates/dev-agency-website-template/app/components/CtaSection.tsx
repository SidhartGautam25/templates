import { SITE } from "@/constants";

export default function CtaSection({
  onOpenEnquiry,
}: {
  onOpenEnquiry: (label?: string) => void;
}) {
  const cta = SITE.agency.cta;

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto rounded-3xl border border-primary/10 bg-bg-card p-10 md:p-14 text-center transition-colors duration-200">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main">
          {cta.title}{" "}
          <span className="bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent">
            {cta.titleAccent}
          </span>
        </h2>
        <p className="mt-4 text-text-muted max-w-xl mx-auto leading-relaxed">{cta.subtitle}</p>
        <button
          type="button"
          onClick={() => onOpenEnquiry(cta.buttonLabel)}
          className="mt-8 px-8 py-3 rounded-full bg-cta-primary text-text-main font-bold text-sm shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all cursor-pointer"
        >
          {cta.buttonLabel}
        </button>
      </div>
    </section>
  );
}
