import type { SupabaseClient } from '@supabase/supabase-js';

import { ensureLocalUserId } from '@/lib/localUserId';
import { supabase } from '@/lib/supabase';
import type { CommunityPost, CommunityReply } from '@/types/community';

function mapPost(row: Record<string, unknown>): CommunityPost {
  return {
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
}

function mapReply(row: Record<string, unknown>): CommunityReply {
  return {
    id: row.id as string,
    post_id: row.post_id as string,
    user_id: (row.user_id as string) ?? null,
    username: row.username as string,
    body: row.body as string,
    helpful_count: (row.helpful_count as number) ?? 0,
    created_at: row.created_at as string,
  };
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('community_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username.trim());

  if (error) {
    console.warn('[Lighthouse] community_profiles check:', error.message);
    return false;
  }
  return (count ?? 0) > 0;
}

export async function createCommunityProfile(
  userId: string,
  username: string,
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('community_profiles').insert({
    user_id: userId,
    username: username.trim(),
  });

  if (error) {
    return { error: new Error(error.message) };
  }
  return { error: null };
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Lighthouse] community_posts fetch:', error.message);
    return [];
  }
  return (data ?? []).map((row) => mapPost(row as Record<string, unknown>));
}

export async function fetchCommunityPost(
  id: string,
): Promise<CommunityPost | null> {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    console.warn('[Lighthouse] community_posts single:', error?.message);
    return null;
  }
  return mapPost(data as Record<string, unknown>);
}

export async function fetchPostReplies(postId: string): Promise<CommunityReply[]> {
  const { data, error } = await supabase
    .from('community_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('[Lighthouse] community_replies fetch:', error.message);
    return [];
  }
  return (data ?? []).map((row) => mapReply(row as Record<string, unknown>));
}

export async function createCommunityPost(input: {
  userId: string;
  username: string;
  title: string;
  body: string;
  tags: string[];
}): Promise<{ post: CommunityPost | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: input.userId,
      username: input.username,
      title: input.title.trim(),
      body: input.body.trim() || null,
      tags: input.tags,
    })
    .select('*')
    .single();

  if (error) {
    return { post: null, error: new Error(error.message) };
  }
  return { post: mapPost(data as Record<string, unknown>), error: null };
}

export async function createCommunityReply(input: {
  postId: string;
  userId: string;
  username: string;
  body: string;
}): Promise<{ reply: CommunityReply | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('community_replies')
    .insert({
      post_id: input.postId,
      user_id: input.userId,
      username: input.username,
      body: input.body.trim(),
    })
    .select('*')
    .single();

  if (error) {
    return { reply: null, error: new Error(error.message) };
  }

  const reply = mapReply(data as Record<string, unknown>);

  const post = await fetchCommunityPost(input.postId);
  if (post) {
    await supabase
      .from('community_posts')
      .update({ reply_count: post.reply_count + 1 })
      .eq('id', input.postId);
  }

  return { reply, error: null };
}

export async function fetchUserHelpfulPostIds(
  userId: string,
): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('community_helpful')
    .select('post_id')
    .eq('user_id', userId)
    .not('post_id', 'is', null);

  if (error) {
    console.warn('[Lighthouse] community_helpful fetch:', error.message);
    return new Set();
  }
  return new Set(
    (data ?? [])
      .map((r) => r.post_id as string | null)
      .filter((id): id is string => id != null),
  );
}

export async function togglePostHelpful(
  userId: string,
  post: CommunityPost,
): Promise<{ helpful: boolean; count: number; error: Error | null }> {
  const { data: existing } = await supabase
    .from('community_helpful')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', post.id)
    .maybeSingle();

  if (existing) {
    await supabase.from('community_helpful').delete().eq('id', existing.id);
    const next = Math.max(0, post.helpful_count - 1);
    await supabase
      .from('community_posts')
      .update({ helpful_count: next })
      .eq('id', post.id);
    return { helpful: false, count: next, error: null };
  }

  const { error: insertError } = await supabase.from('community_helpful').insert({
    user_id: userId,
    post_id: post.id,
    reply_id: null,
  });

  if (insertError) {
    return {
      helpful: false,
      count: post.helpful_count,
      error: new Error(insertError.message),
    };
  }

  const next = post.helpful_count + 1;
  await supabase
    .from('community_posts')
    .update({ helpful_count: next })
    .eq('id', post.id);
  return { helpful: true, count: next, error: null };
}

export function getCommunitySupabase(): SupabaseClient {
  return supabase;
}

export function getCommunityUserId(): string {
  return ensureLocalUserId();
}
