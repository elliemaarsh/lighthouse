import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArticleCard } from '@/components/learn/ArticleCard';
import { LearnFilterChips } from '@/components/learn/LearnFilterChips';
import { articles, articleCategories, type Article } from '@/data/articles';
import {
  LEARN_BACKGROUND,
  LEARN_FILTER_CATEGORIES,
  type LearnFilterId,
} from '@/constants/learn';
import { colors, fonts, spacing } from '@/constants/theme';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import {
  getRecommendedArticles,
  type UserProfileForRecommendations,
} from '@/utils/articleRecommender';
import { useUserStore } from '@/store/useUserStore';

function useProfile(): UserProfileForRecommendations {
  const role = useUserStore((s) => s.role);
  const goals = useUserStore((s) => s.goals);
  const journeyType = useUserStore((s) => s.journeyType);
  const fertilityHistory = useUserStore((s) => s.fertilityHistory);
  const relationshipStructure = useUserStore((s) => s.relationshipStructure);
  const biologicalSex = useUserStore((s) => s.biologicalSex);

  return useMemo(
    () => ({
      role,
      goals,
      journeyType,
      fertilityHistory,
      relationshipStructure,
      biologicalSex,
    }),
    [
      role,
      goals,
      journeyType,
      fertilityHistory,
      relationshipStructure,
      biologicalSex,
    ],
  );
}

function articlesForFilter(filter: LearnFilterId): Article[] {
  if (filter === 'for-you') return [];
  const categories = LEARN_FILTER_CATEGORIES[filter];
  return articles.filter((a) => categories.includes(a.category));
}

export default function LearnIndexScreen() {
  const scrollBottomPad = useTabBarScrollPadding();
  const profile = useProfile();
  const [filter, setFilter] = useState<LearnFilterId>('for-you');

  const recommended = useMemo(
    () => getRecommendedArticles(profile, articles, 8),
    [profile],
  );

  const recommendedIds = useMemo(
    () => new Set(recommended.map((a) => a.id)),
    [recommended],
  );

  const exploreByCategory = useMemo(() => {
    const rest = articles.filter((a) => !recommendedIds.has(a.id));
    return articleCategories
      .map((category) => ({
        category,
        items: rest.filter((a) => a.category === category),
      }))
      .filter((g) => g.items.length > 0);
  }, [recommendedIds]);

  const categoryList = useMemo(() => articlesForFilter(filter), [filter]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headline}>Learn</Text>
        <Text style={styles.subtext}>Curated for your journey</Text>

        <LearnFilterChips selected={filter} onSelect={setFilter} />

        {filter === 'for-you' ? (
          <>
            <Text style={styles.sectionLabel}>RECOMMENDED FOR YOU</Text>
            {recommended.length === 0 ? (
              <Text style={styles.emptyHint}>
                Complete onboarding goals and journey details to see personalized picks.
              </Text>
            ) : (
              recommended.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}

            <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
              EXPLORE ALL TOPICS
            </Text>
            {exploreByCategory.map(({ category, items }) => (
              <View key={category} style={styles.categoryBlock}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hRow}
                >
                  {items.map((article) => (
                    <ArticleCard key={article.id} article={article} compact />
                  ))}
                </ScrollView>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.categoryList}>
            {categoryList.length === 0 ? (
              <Text style={styles.emptyHint}>No articles in this topic yet.</Text>
            ) : (
              categoryList.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LEARN_BACKGROUND,
  },
  scroll: {
    flex: 1,
    backgroundColor: LEARN_BACKGROUND,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  headline: {
    fontSize: 28,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  subtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionLabelSpaced: {
    marginTop: 24,
  },
  categoryBlock: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  hRow: {
    paddingRight: 12,
  },
  categoryList: {
    marginTop: 8,
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
});
