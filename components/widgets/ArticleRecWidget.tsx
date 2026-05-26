import { router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { WidgetAccentLine } from '@/components/widgets/decor/WidgetAccentLine';
import { WidgetDecoratedShell } from '@/components/widgets/decor/WidgetDecoratedShell';
import { widgetText } from '@/components/widgets/WidgetShell';
import { routes } from '@/constants/routes';
import { articles } from '@/data/articles';
import { fonts, homeMist } from '@/constants/theme';
import { getRecommendedArticles } from '@/utils/articleRecommender';
import { useUserStore } from '@/store/useUserStore';

export function ArticleRecWidget() {
  const role = useUserStore((s) => s.role);
  const goals = useUserStore((s) => s.goals);
  const journeyType = useUserStore((s) => s.journeyType);
  const fertilityHistory = useUserStore((s) => s.fertilityHistory);
  const relationshipStructure = useUserStore((s) => s.relationshipStructure);
  const biologicalSex = useUserStore((s) => s.biologicalSex);

  const article = useMemo(() => {
    const profile = {
      role,
      goals,
      journeyType,
      fertilityHistory,
      relationshipStructure,
      biologicalSex,
    };
    return getRecommendedArticles(profile, articles, 1)[0] ?? articles[0];
  }, [
    role,
    goals,
    journeyType,
    fertilityHistory,
    relationshipStructure,
    biologicalSex,
  ]);

  return (
    <WidgetDecoratedShell
      label="ARTICLE"
      onPress={() =>
        router.push({
          pathname: routes.learnArticle,
          params: { id: article.id },
        } as Href)
      }
    >
      <Text style={styles.title} numberOfLines={2}>
        {article.title}
      </Text>
      <WidgetAccentLine width={24} style={styles.accent} />
      <Text style={widgetText.muted}>{article.readTime} read</Text>
    </WidgetDecoratedShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.extraLight,
    fontSize: 18,
    lineHeight: 24,
    color: homeMist.textPrimary,
    zIndex: 1,
  },
  accent: {
    marginVertical: 8,
  },
});
