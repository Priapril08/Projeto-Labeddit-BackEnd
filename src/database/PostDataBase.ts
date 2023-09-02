import {
  CommentDB,
  LikeDislikeCommentDB,
  LikesDislikesDB,
} from "../models/Comments";
import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  [x: string]: any;
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes";
  public static TABLE_COMMENTS_POSTS = "comments_posts";
  public static TABLE_USERS = "users";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";

  public getAllPosts = async () => {
    const postDB = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).select();
    return postDB;
  };

  public getPostById = async (id: string): Promise<PostDB | undefined> => {
    const [postDB]: PostDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    )
      .select()
      .where({ id: id });

    return postDB;
  };

  public getPostCreator = async () => {
    const postsDB = await this.getAllPosts();
    const creatorsDB = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).select();

    return {
      postsDB,
      creatorsDB,
    };
  };

  public getPostWithComments = async (id: string) => {
    const postsDB = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select()
      .where({ id: id });

    const creatorsDB = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).select();

    const commentsDB = await BaseDatabase.connection(
      PostDatabase.TABLE_COMMENTS_POSTS
    )
      .select("comments_posts.*", "users.name")
      .leftJoin(
        PostDatabase.TABLE_USERS,
        "users.id",
        "=",
        "comments_posts.creator_id"
      );
    return {
      postsDB,
      creatorsDB,
      commentsDB,
    };
  };

  public getCommentId = async (id: string): Promise<CommentDB | undefined> => {
    const [commentDB]: CommentDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_COMMENTS_POSTS
    )
      .select()
      .where({ id: id });

    return commentDB;
  };

  public async insertPost(newPostDB: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(newPostDB);
  }

  public editPost = async (editPostDB: PostDB, id: string) => {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(editPostDB)
      .where({ id: id });
  };

  public async idFindPost(id: string): Promise<PostDB | undefined> {
    const postDBExists: PostDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });
    return postDBExists[0];
  }

  public async deletePost(id: string): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).where({ id }).del();
  }

  public findLikeDislike = async (
    user_id: string,
    post_id: string
  ): Promise<LikesDislikesDB | undefined> => {
    const [result]: LikesDislikesDB[] | undefined =
      await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({ user_id: user_id, post_id: post_id });
    return result;
  };

  public removeLikeDislike = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likesDislikesDB.user_id,
        post_id: likesDislikesDB.post_id,
      });
  };

  public updateLikeDislike = async (uplikeDislike: LikesDislikesDB) => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
      uplikeDislike
    );
  };

  public insertLikesDislikes = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
      likesDislikesDB
    );
  };

  public findCommentById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    const [commentDB]: CommentDB[] | undefined = await BaseDatabase.connection(
      PostDatabase.TABLE_COMMENTS_POSTS
    )
      .select()
      .where({ id: id });
    return commentDB;
  };

  public findLikeDislikeComment = async (
    id: string
  ): Promise<LikeDislikeCommentDB[] | undefined> => {
    const result: LikeDislikeCommentDB[] | undefined =
      await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
        .select()
        .where({ comment_id: id });
    return result;
  };

  public deleteLikeDislikeComment = async (id: string) => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .del()
      .where({ comment_id: id });
  };

  public editLikeDislikeComment = async (
    editLikeDislike: LikeDislikeCommentDB
  ) => {
    await BaseDatabase.connection(
      PostDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(editLikeDislike);
  };

  public insertComment = async (newCommentDB: CommentDB) => {
    await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS_POSTS).insert(
      newCommentDB
    );
  };

  public editComment = async (editPost: PostDB, id: string) => {
    await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS_POSTS)
      .update(editPost)
      .where({ id: id });
  };

  public deleteComment = async (id: string) => {
    await BaseDatabase.connection(PostDatabase.TABLE_COMMENTS_POSTS)
      .del()
      .where({ post_id: id });
  };
}
