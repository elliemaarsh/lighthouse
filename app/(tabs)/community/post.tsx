import { Ionicons } from '@expo/vector-icons';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COMMUNITY_SURFACE } from '@/constants/community';
import { lightCardShadow } from '@/constants/glass';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fonts, spacing } from '@/constants/theme';
import {
  createCommunityReply,
  fetchCommunityPost,
  fetchPostReplies,
  fetchUserHelpfulPostIds,
  getCommunityUserId,
  togglePostHelpful,
} from '@/lib/community';
import { timeAgo } from '@/lib/timeAgo';
import { noFocusRing } from '@/lib/focusRing';
import type { CommunityPost, CommunityReply } from '@/types/community';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

function ReplyCard({ reply }: { reply: CommunityReply }) {
  return (
    <View style={styles.replyShell}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, styles.replyFallback]} />
      ) : (
        <BlurView
          blurType="light"
          blurAmount={12}
          style={StyleSheet.absoluteFill}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.5)"
        />
      )}
      <View style={styles.replyInner}>
        <View style={styles.replyTop}>
          <Text style={styles.replyUser}>@{reply.username}</Text>
          <Text style={styles.replyTime}>{timeAgo(reply.created_at)}</Text>
        </View>
        <Text style={styles.replyBody}>{reply.body}</Text>
        <View style={styles.replyHelpful}>
          <Ionicons name="heart-outline" size={12} color={colors.textMuted} />
          <Text style={styles.replyHelpfulText}>
            {reply.helpful_count} helpful
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function CommunityPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const communityUsername = useUserStore((s) => s.communityUsername);

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const p = await fetchCommunityPost(id);
    setPost(p);
    const r = await fetchPostReplies(id);
    setReplies(r);
    const helpful = await fetchUserHelpfulPostIds(getCommunityUserId());
    setMarkedHelpful(helpful.has(id));
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
      void load();
      return () => setTabBarHidden(false);
    }, [load, setTabBarHidden]),
  );

  const toggleHelpful = async () => {
    if (!post) return;
    const userId = getCommunityUserId();
    const result = await togglePostHelpful(userId, post);
    if (!result.error) {
      setMarkedHelpful(result.helpful);
      setPost({ ...post, helpful_count: result.count });
    }
  };

  const sendReply = async () => {
    if (!post || !replyText.trim() || !communityUsername || sending) return;
    setSending(true);
    const { reply, error } = await createCommunityReply({
      postId: post.id,
      userId: getCommunityUserId(),
      username: communityUsername,
      body: replyText,
    });
    setSending(false);
    if (reply && !error) {
      setReplyText('');
      setReplies((prev) => [...prev, reply]);
      setPost({
        ...post,
        reply_count: post.reply_count + 1,
      });
    }
  };

  if (!post) {
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.missing}>Post not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, noFocusRing]}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.postShell}>
            {Platform.OS === 'web' ? (
              <View style={[StyleSheet.absoluteFill, styles.postFallback]} />
            ) : (
              <BlurView
                blurType="light"
                blurAmount={16}
                style={StyleSheet.absoluteFill}
                reducedTransparencyFallbackColor="rgba(255,255,255,0.55)"
              />
            )}
            <View style={styles.postInner}>
              <View style={styles.postTop}>
                <Text style={styles.postUser}>@{post.username}</Text>
                <Text style={styles.postTime}>{timeAgo(post.created_at)}</Text>
              </View>
              <Text style={styles.categoryPill}>{post.tags[0] ?? 'Community'}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              {post.body ? (
                <Text style={styles.postBody}>{post.body}</Text>
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
            </View>
          </View>

          <Pressable
            onPress={() => void toggleHelpful()}
            style={[
              styles.helpfulBtn,
              markedHelpful && styles.helpfulBtnActive,
              noFocusRing,
            ]}
          >
            <Text style={styles.helpfulBtnText}>
              {markedHelpful ? '♥' : '♡'} Mark as helpful ({post.helpful_count})
            </Text>
          </Pressable>

          <Text style={styles.repliesLabel}>
            {post.reply_count} {post.reply_count === 1 ? 'REPLY' : 'REPLIES'}
          </Text>
          {replies.map((reply) => (
            <ReplyCard key={reply.id} reply={reply} />
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Reply anonymously..."
            placeholderTextColor={colors.textMuted}
            style={styles.composerInput}
            editable={!sending}
          />
          <Pressable
            onPress={() => void sendReply()}
            disabled={!replyText.trim() || sending}
            style={[
              styles.sendBtn,
              (!replyText.trim() || sending) && styles.sendBtnDisabled,
              noFocusRing,
            ]}
          >
            <Ionicons name="arrow-up" size={16} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COMMUNITY_SURFACE,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 8,
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
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  postShell: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: colors.white,
    ...lightCardShadow,
  },
  postFallback: {
    backgroundColor: colors.white,
  },
  postInner: {
    padding: 20,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postUser: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  postTime: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    fontSize: 11,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  postTitle: {
    fontSize: 20,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginTop: 10,
    lineHeight: 28,
  },
  postBody: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 26,
    marginTop: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
  },
  tag: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  helpfulBtn: {
    marginTop: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.buttonGhostBorder,
    paddingVertical: 14,
    alignItems: 'center',
  },
  helpfulBtnActive: {
    backgroundColor: 'rgba(26, 36, 34, 0.06)',
  },
  helpfulBtnText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  repliesLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
    letterSpacing: 2,
    color: colors.textMuted,
    marginTop: 24,
    marginBottom: 12,
  },
  replyShell: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 0,
    backgroundColor: colors.white,
    ...lightCardShadow,
  },
  replyFallback: {
    backgroundColor: colors.white,
  },
  replyInner: {
    padding: 16,
  },
  replyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyUser: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  replyTime: {
    fontSize: 11,
    color: colors.textMuted,
  },
  replyBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 22,
    marginTop: 8,
  },
  replyHelpful: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  replyHelpfulText: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  composerInput: {
    ...inputFieldStyle,
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#27359E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.35,
  },
  missing: {
    padding: 24,
    fontSize: 16,
    color: colors.textSecondary,
  },
});
