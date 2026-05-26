import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import type { Article } from '@/data/articles';
import { routes } from '@/constants/routes';
import { colors, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type ArticleCardProps = {
  article: Article;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const open = () => {
    router.push({
      pathname: routes.learnArticle,
      params: { id: article.id },
    } as Href);
  };

  if (compact) {
    return (
      <Pressable onPress={open} style={[styles.compactWrap, noFocusRing]}>
        <GlassSurface
          variant="card"
          borderRadius={20}
          shadow="soft"
          style={styles.compactShell}
        >
          <View style={styles.compactContent}>
            <Text style={styles.compactTitle} numberOfLines={2}>
              {article.title}
            </Text>
          </View>
        </GlassSurface>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={open} style={[styles.wrap, noFocusRing]}>
      <GlassSurface variant="card" borderRadius={20} shadow="soft" style={styles.shell}>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.categoryPill}>{article.category}</Text>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {article.subtitle}
          </Text>
          <Text style={styles.cta}>Read →</Text>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  shell: {
    width: '100%',
  },
  compactWrap: {
    width: 220,
    height: 120,
    marginRight: 12,
  },
  compactShell: {
    flex: 1,
    height: '100%',
  },
  content: {
    padding: 20,
  },
  compactContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryPill: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: 'hidden',
    flexShrink: 1,
  },
  readTime: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 8,
    lineHeight: 24,
  },
  compactTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  cta: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginTop: 12,
  },
});
