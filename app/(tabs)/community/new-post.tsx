import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Redirect, router } from 'expo-router';
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

import { PillButton } from '@/components/onboarding/PillButton';
import {
  COMMUNITY_SURFACE,
  MAX_POST_TAGS,
  MAX_TAG_LENGTH,
  SUGGESTED_POST_TAGS,
} from '@/constants/community';
import { routes } from '@/constants/routes';
import { inputFieldStyle } from '@/constants/surfaces';
import { colors, fonts, spacing } from '@/constants/theme';
import { createCommunityPost, getCommunityUserId } from '@/lib/community';
import { noFocusRing } from '@/lib/focusRing';
import { useTabBarStore } from '@/store/useTabBarStore';
import { useUserStore } from '@/store/useUserStore';

export default function NewPostScreen() {
  const hasSetUpCommunity = useUserStore((s) => s.hasSetUpCommunity);
  const setTabBarHidden = useTabBarStore((s) => s.setHidden);
  const communityUsername = useUserStore((s) => s.communityUsername);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [posting, setPosting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTabBarHidden(true);
      return () => setTabBarHidden(false);
    }, [setTabBarHidden]),
  );

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t || tags.length >= MAX_POST_TAGS) return;
    if (t.length > MAX_TAG_LENGTH) return;
    if (tags.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    setTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  if (!hasSetUpCommunity) {
    return <Redirect href={routes.communitySetup} />;
  }

  const handlePost = async () => {
    if (!title.trim() || posting || !communityUsername) return;
    setPosting(true);
    const { error } = await createCommunityPost({
      userId: getCommunityUserId(),
      username: communityUsername,
      title,
      body,
      tags,
    });
    setPosting(false);
    if (!error) {
      router.replace(routes.community);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeBtn, noFocusRing]}
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.postingAs}>
            Posting as @{communityUsername ?? 'anonymous'}
          </Text>

          <Text style={styles.label}>TITLE</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
            style={styles.titleInput}
          />

          <Text style={styles.label}>SHARE MORE (OPTIONAL)</Text>
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="You don't have to share everything — even a little goes a long way for someone reading this."
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.bodyInput}
          />

          <Text style={styles.label}>ADD TAGS</Text>
          <Text style={styles.tagSub}>
            Help others find your post. Create your own or use common ones.
          </Text>
          <View style={styles.tagInputRow}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add a tag"
              placeholderTextColor={colors.textMuted}
              maxLength={MAX_TAG_LENGTH}
              style={styles.tagField}
              onSubmitEditing={() => addTag(tagInput)}
            />
            <Pressable
              style={styles.addTagBtn}
              onPress={() => addTag(tagInput)}
            >
              <Text style={styles.addTagBtnText}>Add</Text>
            </Pressable>
          </View>

          {tags.length > 0 ? (
            <View style={styles.selectedTags}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  style={styles.tagChip}
                  onPress={() => removeTag(tag)}
                >
                  <Text style={styles.tagChipText}>{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.suggested}>
            {SUGGESTED_POST_TAGS.map((tag) => (
              <Pressable
                key={tag}
                style={styles.suggestedChip}
                onPress={() => addTag(tag)}
              >
                <Text style={styles.suggestedText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PillButton
            label={posting ? 'Posting...' : 'Post to community'}
            onPress={() => void handlePost()}
            disabled={!title.trim() || posting}
            tier={2}
            style={styles.postBtn}
          />
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
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  postingAs: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 1,
    color: colors.textMuted,
    marginBottom: 6,
    marginTop: 12,
  },
  titleInput: {
    ...inputFieldStyle,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  bodyInput: {
    ...inputFieldStyle,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  tagSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  tagField: {
    ...inputFieldStyle,
    flex: 1,
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  addTagBtn: {
    backgroundColor: colors.textPrimary,
    borderRadius: 100,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
  },
  addTagBtnText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textPrimary,
    borderRadius: 100,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    gap: 4,
  },
  tagChipText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  tagRemove: {
    fontSize: 16,
    color: colors.white,
    lineHeight: 18,
  },
  suggested: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  suggestedChip: {
    backgroundColor: colors.white,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
  suggestedText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  postBtn: {
    alignSelf: 'stretch',
  },
});
