export interface CommentWithCreatorDB {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  post_id: string;
  creator: {
    creator_id: string;
    name: string;
  };
}

export interface CommentDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  post_id: string;
}

export interface LikesDislikesDB {
  user_id: string;
  post_id: string;
  like: number;
}

export interface LikeDislikeCommentDB {
  user_id: string;
  comment_id: string;
  like: number;
}
