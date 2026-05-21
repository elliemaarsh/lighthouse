import type { Article } from '@/data/articles';

export type UserProfileForRecommendations = {
  role: string | null;
  goals: string[];
  journeyType: string[];
  fertilityHistory: string[];
  relationshipStructure: string | null;
  biologicalSex: string | null;
};

function overlaps(a: string[] | undefined, b: string[]): boolean {
  if (!a?.length || !b.length) return false;
  return a.some((item) => b.includes(item));
}

function scoreArticle(article: Article, profile: UserProfileForRecommendations): number {
  const rf = article.relevantFor;
  let score = 0;

  if (rf.roles?.length && profile.role) {
    const role = profile.role;
    const matches =
      rf.roles.includes(role as 'carrying' | 'non-carrying' | 'both') ||
      rf.roles.includes('both') ||
      (role === 'both' &&
        (rf.roles.includes('carrying') || rf.roles.includes('non-carrying')));
    if (matches) score += 1;
  }

  if (overlaps(rf.goals, profile.goals)) score += 1;
  if (overlaps(rf.journeyTypes, profile.journeyType)) score += 1;
  if (overlaps(rf.fertilityHistory, profile.fertilityHistory)) score += 1;

  if (
    rf.relationshipStructures?.length &&
    profile.relationshipStructure &&
    rf.relationshipStructures.includes(profile.relationshipStructure)
  ) {
    score += 1;
  }

  if (rf.biologicalSex?.length && profile.biologicalSex) {
    const sex =
      profile.biologicalSex === 'prefer not to say'
        ? null
        : profile.biologicalSex;
    if (sex && rf.biologicalSex.includes(sex)) score += 1;
  }

  return score;
}

export function getRecommendedArticles(
  userProfile: UserProfileForRecommendations,
  allArticles: Article[],
  limit = 8,
): Article[] {
  const ranked = allArticles
    .map((article) => ({ article, score: scoreArticle(article, userProfile) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const result: Article[] = [];
  for (const { article } of ranked) {
    if (result.length >= limit) break;
    if (seen.has(article.id)) continue;
    seen.add(article.id);
    result.push(article);
  }

  return result;
}

export function getRelatedArticles(
  article: Article,
  allArticles: Article[],
  profile: UserProfileForRecommendations,
  limit = 3,
): Article[] {
  const sameCategory = allArticles.filter(
    (a) => a.category === article.category && a.id !== article.id,
  );
  return getRecommendedArticles(profile, sameCategory, limit);
}
