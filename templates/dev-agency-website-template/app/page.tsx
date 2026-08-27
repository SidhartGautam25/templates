import { agencyService } from "@/lib/features/agency";
import HomePage from "./HomePage";

export default async function Page() {
  const [expertise, team, work] = await Promise.all([
    agencyService.getExpertisePublic(),
    agencyService.getTeamPublic(),
    agencyService.getWorkPublic(),
  ]);

  return <HomePage expertise={expertise} team={team} work={work} />;
}
