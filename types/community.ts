export type CommunityPost = {
  id: string;
  user_id: string | null;
  username: string;
  title: string;
  body: string | null;
  tags: string[];
  helpful_count: number;
  reply_count: number;
  created_at: string;
};

export type CommunityReply = {
  id: string;
  post_id: string;
  user_id: string | null;
  username: string;
  body: string;
  helpful_count: number;
  created_at: string;
};
