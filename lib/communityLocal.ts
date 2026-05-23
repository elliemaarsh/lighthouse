import AsyncStorage from '@react-native-async-storage/async-storage';

import { seedPosts as seedPostRows } from '@/data/seedPosts';
import { isClient } from '@/lib/storage';
import type { CommunityPost, CommunityReply } from '@/types/community';

const PROFILES_KEY = 'lighthouse:community:profiles';
const POSTS_KEY = 'lighthouse:community:posts';
const REPLIES_KEY = 'lighthouse:community:replies';
const HELPFUL_KEY = 'lighthouse:community:helpful';
const SEEDED_KEY = 'lighthouse:community:local-seeded';

type StoredProfile = { user_id: string; username: string };
type StoredHelpful = { user_id: string; post_id: string };

function generateId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function readJson<T>(key: string, fallback: T): Promise<T> {
  if (!isClient) return fallback;
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  if (!isClient) return;
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

function mapSeedToPost(row: (typeof seedPostRows)[number]): CommunityPost {
  return {
    id: generateId(),
    user_id: row.user_id,
    username: row.username,
    title: row.title,
    body: row.body,
    tags: row.tags,
    helpful_count: row.helpful_count,
    reply_count: row.reply_count,
    created_at: row.created_at,
  };
}

export async function ensureLocalCommunitySeeded(): Promise<void> {
  const seeded = await readJson<boolean>(SEEDED_KEY, false);
  if (seeded) return;

  const posts = seedPostRows.map(mapSeedToPost);
  await writeJson(POSTS_KEY, posts);
  await writeJson(SEEDED_KEY, true);
}

export async function localIsUsernameTaken(username: string): Promise<boolean> {
  const profiles = await readJson<StoredProfile[]>(PROFILES_KEY, []);
  const needle = username.trim().toLowerCase();
  return profiles.some((p) => p.username.toLowerCase() === needle);
}

export async function localSaveProfile(
  userId: string,
  username: string,
): Promise<void> {
  const profiles = await readJson<StoredProfile[]>(PROFILES_KEY, []);
  const trimmed = username.trim();
  const withoutUser = profiles.filter((p) => p.user_id !== userId);
  await writeJson(PROFILES_KEY, [
    ...withoutUser,
    { user_id: userId, username: trimmed },
  ]);
}

export async function localFetchPosts(): Promise<CommunityPost[]> {
  await ensureLocalCommunitySeeded();
  const posts = await readJson<CommunityPost[]>(POSTS_KEY, []);
  return [...posts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function localFetchPost(id: string): Promise<CommunityPost | null> {
  const posts = await localFetchPosts();
  return posts.find((p) => p.id === id) ?? null;
}

export async function localFetchReplies(postId: string): Promise<CommunityReply[]> {
  const all = await readJson<CommunityReply[]>(REPLIES_KEY, []);
  return all
    .filter((r) => r.post_id === postId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
}

export async function localCreatePost(input: {
  userId: string;
  username: string;
  title: string;
  body: string;
  tags: string[];
}): Promise<CommunityPost> {
  const posts = await readJson<CommunityPost[]>(POSTS_KEY, []);
  const post: CommunityPost = {
    id: generateId(),
    user_id: input.userId,
    username: input.username,
    title: input.title.trim(),
    body: input.body.trim() || null,
    tags: input.tags,
    helpful_count: 0,
    reply_count: 0,
    created_at: new Date().toISOString(),
  };
  await writeJson(POSTS_KEY, [post, ...posts]);
  return post;
}

export async function localCreateReply(input: {
  postId: string;
  userId: string;
  username: string;
  body: string;
}): Promise<CommunityReply> {
  const replies = await readJson<CommunityReply[]>(REPLIES_KEY, []);
  const reply: CommunityReply = {
    id: generateId(),
    post_id: input.postId,
    user_id: input.userId,
    username: input.username,
    body: input.body.trim(),
    helpful_count: 0,
    created_at: new Date().toISOString(),
  };
  await writeJson(REPLIES_KEY, [...replies, reply]);

  const posts = await readJson<CommunityPost[]>(POSTS_KEY, []);
  const idx = posts.findIndex((p) => p.id === input.postId);
  if (idx >= 0) {
    posts[idx] = { ...posts[idx], reply_count: posts[idx].reply_count + 1 };
    await writeJson(POSTS_KEY, posts);
  }

  return reply;
}

export async function localFetchHelpfulPostIds(userId: string): Promise<Set<string>> {
  const rows = await readJson<StoredHelpful[]>(HELPFUL_KEY, []);
  return new Set(rows.filter((r) => r.user_id === userId).map((r) => r.post_id));
}

export async function localTogglePostHelpful(
  userId: string,
  post: CommunityPost,
): Promise<{ helpful: boolean; count: number }> {
  const helpfulRows = await readJson<StoredHelpful[]>(HELPFUL_KEY, []);
  const existing = helpfulRows.find(
    (r) => r.user_id === userId && r.post_id === post.id,
  );

  const posts = await readJson<CommunityPost[]>(POSTS_KEY, []);
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx < 0) {
    return { helpful: false, count: post.helpful_count };
  }

  if (existing) {
    await writeJson(
      HELPFUL_KEY,
      helpfulRows.filter((r) => !(r.user_id === userId && r.post_id === post.id)),
    );
    const count = Math.max(0, posts[idx].helpful_count - 1);
    posts[idx] = { ...posts[idx], helpful_count: count };
    await writeJson(POSTS_KEY, posts);
    return { helpful: false, count };
  }

  await writeJson(HELPFUL_KEY, [...helpfulRows, { user_id: userId, post_id: post.id }]);
  const count = posts[idx].helpful_count + 1;
  posts[idx] = { ...posts[idx], helpful_count: count };
  await writeJson(POSTS_KEY, posts);
  return { helpful: true, count };
}
