import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArticleCard } from '@/components/learn/ArticleCard';
import { articles, getArticleById } from '@/data/articles';
import { LEARN_BACKGROUND } from '@/constants/learn';
import { colors, fonts, spacing } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';
import { getRelatedArticles } from '@/utils/articleRecommender';
import { useUserStore } from '@/store/useUserStore';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticleById(id ?? '');

  const role = useUserStore((s) => s.role);
  const goals = useUserStore((s) => s.goals);
  const journeyType = useUserStore((s) => s.journeyType);
  const fertilityHistory = useUserStore((s) => s.fertilityHistory);
  const relationshipStructure = useUserStore((s) => s.relationshipStructure);
  const biologicalSex = useUserStore((s) => s.biologicalSex);

  const profile = useMemo(
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

  const related = useMemo(() => {
    if (!article) return [];
    return getRelatedArticles(article, articles, profile, 3);
  }, [article, profile]);

  if (!article) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.missing}>Article not found.</Text>
      </SafeAreaView>
    );
  }

  const paragraphs = article.body.split('\n\n').filter(Boolean);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, noFocusRing]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerCategory} numberOfLines={1}>
          {article.category}
        </Text>
        <Text style={styles.headerTime}>{article.readTime}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.subtitle}>{article.subtitle}</Text>
        <View style={styles.divider} />
        {paragraphs.map((para, index) => (
          <Text key={index} style={styles.bodyPara}>
            {para}
          </Text>
        ))}

        {related.length > 0 ? (
          <View style={styles.related}>
            <Text style={styles.relatedLabel}>RELATED ARTICLES</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedRow}
            >
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} compact />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LEARN_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
    gap: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.cardUnselectedBg,
    borderWidth: 1,
    borderColor: colors.cardUnselectedBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCategory: {
    flex: 1,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  headerTime: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    minWidth: 48,
    textAlign: 'right',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(26, 36, 34, 0.08)',
    marginVertical: 20,
  },
  bodyPara: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 28,
    marginBottom: 16,
  },
  related: {
    marginTop: 32,
  },
  relatedLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginBottom: 12,
  },
  relatedRow: {
    paddingRight: 12,
  },
  missing: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    padding: 24,
  },
});
