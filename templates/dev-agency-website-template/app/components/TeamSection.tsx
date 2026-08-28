import type { AgencyTeamMember } from "@prisma/client";
import Link from "next/link";
import { User } from "lucide-react";
import { SITE } from "@/constants";
import { TEAM_AVATAR_COLORS } from "@/lib/agency/gradients";

function TeamCard({ member, className }: { member: AgencyTeamMember; className?: string }) {
  const color = TEAM_AVATAR_COLORS[member.avatarColor] ?? TEAM_AVATAR_COLORS.blue;
  return (
    <div
      className={`rounded-2xl border border-primary/10 bg-bg-card p-6 flex flex-col transition-colors duration-200 ${className ?? ""}`}
    >
      <div
        className={`w-12 h-12 rounded-full ring-2 flex items-center justify-center mb-4 ${color}`}
      >
        <User className="w-6 h-6" />
      </div>
      <p className="font-bold text-text-main">{member.name}</p>
      <p className="text-sm text-text-muted mt-1">{member.role}</p>
    </div>
  );
}

export default function TeamSection({ members }: { members: AgencyTeamMember[] }) {
  const section = SITE.agency.team;
  const topRow = members.slice(0, 2);
  const bottomRow = members.slice(2);

  return (
    <section id="team" className="py-24 px-6 border-t border-primary/10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main leading-tight">
            {section.title}{" "}
            <span className="bg-gradient-to-r from-primary to-accent-gold bg-clip-text text-transparent">
              {section.titleAccent}
            </span>
          </h2>
          <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link
            href={`#${section.ctaSectionId}`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-text-main hover:text-primary transition-colors"
          >
            {section.ctaLabel} →
          </Link>
        </div>

        <div className="space-y-4">
          {topRow.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              {topRow.map((m) => <TeamCard key={m.id} member={m} />)}
            </div>
          )}
          {bottomRow.map((m) => <TeamCard key={m.id} member={m} />)}
        </div>
      </div>
    </section>
  );
}
