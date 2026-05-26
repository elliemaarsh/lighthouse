import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CommunityTagChips } from '@/components/community/CommunityTagChips';
import { PostCard } from '@/components/community/PostCard';
import { seedCommunityIfEmpty } from '@/data/seedPosts';
import { COMMUNITY_SURFACE } from '@/constants/community';
import { routes } from '@/constants/routes';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fonts, spacing } from '@/constants/theme';
import {
  fetchCommunityPosts,
  fetchUserHelpfulPostIds,
  getCommunitySupabase,
  getCommunityUserId,
} from '@/lib/community';
import { useTabBarScrollPadding } from '@/hooks/useTabBarScrollPadding';
import { noFocusRing } from '@/lib/focusRing';
import type { CommunityPost } from '@/types/community';
import { useUserStore } from '@/store/useUserStore';

type TagFilter = { id: string; label: string };

const ALL_TAG: TagFilter = { id: 'all', label: 'All' };

function uniqueTags(posts: CommunityPost[]): string[] {
  const set = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function CommunityIndexScreen() {
  const hasSetUpCommunity = useUserStore((s) => s.hasSetUpCommunity);
  const communityUsername = useUserStore((s) => s.communityUsername);
  const scrollBottomPad = useTabBarScrollPadding();
  const fabBottom = useTabBarScrollPadding({ extra: 0 }) - 24;

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    await seedCommunityIfEmpty(getCommunitySupabase());
    const list = await fetchCommunityPosts();
    setPosts(list);
    const userId = getCommunityUserId();
    const ids = await fetchUserHelpfulPostIds(userId);
    setHelpfulIds(ids);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hasSetUpCommunity) return;
    void loadPosts();
  }, [hasSetUpCommunity, loadPosts]);

  useEffect(() => {
    if (!hasSetUpCommunity) return;

    const client = getCommunitySupabase();
    const channel = client
      .channel('community_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts',
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          const post: CommunityPost = {
            id: row.id as string,
            user_id: (row.user_id as string) ?? null,
            username: row.username as string,
            title: row.title as string,
            body: (row.body as string) ?? null,
            tags: (row.tags as string[]) ?? [],
            helpful_count: (row.helpful_count as number) ?? 0,
            reply_count: (row.reply_count as number) ?? 0,
            created_at: row.created_at as string,
          };
          setPosts((prev) => {
            if (prev.some((p) => p.id === post.id)) return prev;
            return [post, ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [hasSetUpCommunity]);

  const tagChips: TagFilter[] = useMemo(() => {
    const tags = uniqueTags(posts);
    return [
      ALL_TAG,
      ...tags.map((t) => ({ id: t, label: t })),
      { id: 'add-tag', label: '+ Add tag' },
    ];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (selectedTag !== 'all' && selectedTag !== 'add-tag') {
        if (!post.tags.includes(selectedTag)) return false;
      }
      if (!q) return true;
      const inTitle = post.title.toLowerCase().includes(q);
      const inTags = post.tags.some((t) => t.toLowerCase().includes(q));
      const inBody = post.body?.toLowerCase().includes(q);
      return inTitle || inTags || inBody;
    });
  }, [posts, search, selectedTag]);

  if (!hasSetUpCommunity) {
    return <Redirect href={routes.communitySetup} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Text style={styles.headline}>Community</Text>
          {communityUsername ? (
            <View style={styles.userPill}>
              <Text style={styles.userPillText}>@{communityUsername}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.subtext}>A space to share, listen, and feel less alone.</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search posts or tags..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        <CommunityTagChips
          chips={tagChips}
          selectedId={selectedTag}
          onSelect={setSelectedTag}
        />
      </View>

      <ScrollView
        style={styles.postScroll}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: scrollBottomPad },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading && filteredPosts.length === 0 ? (
          <Text style={styles.empty}>Loading posts...</Text>
        ) : null}
        {!loading && filteredPosts.length === 0 ? (
          <Text style={styles.empty}>No posts match your search.</Text>
        ) : null}
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            markedHelpful={helpfulIds.has(post.id)}
          />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.fab, { bottom: fabBottom }, noFocusRing]}
        onPress={() => router.push(routes.communityNewPost)}
        accessibilityRole="button"
        accessibilityLabel="Create post"
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COMMUNITY_SURFACE,
  },
  topSection: {
    flexShrink: 0,
  },
  postScroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    gap: 12,
  },
  headline: {
    fontSize: 28,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  userPill: {
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  userPillText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  subtext: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: inputFieldStyle.backgroundColor,
    borderRadius: 100,
    height: 44,
    paddingHorizontal: 20,
    marginHorizontal: 24,
    borderWidth: inputFieldStyle.borderWidth,
    borderColor: inputFieldStyle.borderColor,
  },
  searchInput: {
    flex: 1,
    backgroundColor: inputFieldStyle.backgroundColor,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  empty: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.textPrimary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
