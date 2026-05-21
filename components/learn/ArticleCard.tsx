import { BlurView } from '@react-native-community/blur';
import { router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Article } from '@/data/articles';
import { colors, fonts } from '@/constants/theme';
import { noFocusRing } from '@/lib/focusRing';

type ArticleCardProps = {
  article: Article;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const open = () => {
    router.push({
      pathname: '/(tabs)/learn/article',
      params: { id: article.id },
    });
  };

  if (compact) {
    return (
      <Pressable onPress={open} style={[styles.compactWrap, noFocusRing]}>
        <ArticleGlass compact>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {article.title}
          </Text>
        </ArticleGlass>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={open} style={[styles.wrap, noFocusRing]}>
      <ArticleGlass>
        <View style={styles.topRow}>
          <Text style={styles.categoryPill}>{article.category}</Text>
          <Text style={styles.readTime}>{article.readTime}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {article.subtitle}
        </Text>
        <Text style={styles.cta}>Read →</Text>
      </ArticleGlass>
    </Pressable>
  );
}

function ArticleGlass({
  children,
  compact,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <View style={[styles.glassShell, compact && styles.glassShellCompact]}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, styles.glassFallback]} />
      ) : (
        <BlurView
          blurType="light"
          blurAmount={16}
          style={StyleSheet.absoluteFill}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.55)"
        />
      )}
      <View style={[styles.glassContent, compact && styles.glassContentCompact]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  compactWrap: {
    width: 220,
    height: 120,
    marginRight: 12,
  },
  glassShell: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassShellCompact: {
    flex: 1,
    height: '100%',
  },
  glassFallback: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  glassContent: {
    padding: 20,
  },
  glassContentCompact: {
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
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
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
