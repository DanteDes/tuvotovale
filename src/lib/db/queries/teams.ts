import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type Team, teams } from "@/lib/db/schema";

export async function getTeams(): Promise<Team[]> {
  return db.select().from(teams).orderBy(desc(teams.votesCount));
}

export async function getTeamBySlug(slug: string): Promise<Team | undefined> {
  const [team] = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  return team;
}
