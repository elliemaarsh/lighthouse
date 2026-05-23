import { Ionicons } from '@expo/vector-icons';
import { BlurView } from '@react-native-community/blur';
import { router, type Href } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { routes } from '@/constants/routes';
import { colors, fonts } from '@/constants/theme';
import { timeAgo } from '@/lib/timeAgo';
import { noFocusRing } from '@/lib/focusRing';
import type { CommunityPost } from '@/types/community';

type PostCardProps = {
  post: CommunityPost;
  markedHelpful?: boolean;
};

export function PostCard({ post, markedHelpful = false }: PostCardProps) {
  const open = () => {
    router.push({
      pathname: routes.communityPost,
      params: { id: post.id },
    } as Href);
  };

  return (
    <Pressable onPress={open} style={[styles.wrap, noFocusRing]}>
      <View style={styles.glassShell}>
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
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.username}>@{post.username}</Text>
            <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          {post.body ? (
            <Text style={styles.body} numberOfLines={3} ellipsizeMode="tail">
              {post.body}
            </Text>
          ) : null}
          {post.tags.length > 0 ? (
            <View style={styles.tags}>
              {post.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          ) : null}
          <View style={styles.bottomRow}>
            <View style={styles.stat}>
              <Ionicons
                name="chatbubble-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={styles.statText}>
                {post.reply_count} {post.reply_count === 1 ? 'reply' : 'replies'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Ionicons
                name={markedHelpful ? 'heart' : 'heart-outline'}
                size={14}
                color={markedHelpful ? colors.accentRose : colors.textMuted}
              />
              <Text style={styles.statText}>
                {post.helpful_count} found this helpful
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  glassShell: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  glassFallback: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  content: {
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  time: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 6,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginLeft: 4,
    flexShrink: 1,
  },
});
