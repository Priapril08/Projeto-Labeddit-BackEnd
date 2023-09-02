import { PostDatabase } from "../database/PostDataBase";
import { UserDatabase } from "../database/UserDatabase";
import { CreateCommentInputDTO } from "../dtos/post/createComment.dto";
import { CreatePostInputDTO } from "../dtos/post/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import { EditPostInputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO } from "../dtos/post/getPosts.dto";
import { GetPostByIdInputDTO } from "../dtos/post/getPostsById";
import { LikeOrDislikeInputDTO } from "../dtos/post/likeOrDislike.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPosts = async (input: GetPostsInputDTO) => {
    const { q, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token' não foi informado!");
    }
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("'Token' não válido!");
    }

    const { postsDB, creatorsDB } = await this.postDatabase.getPostCreator();

    const posts = postsDB.map((postDB) => {
      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.comments,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        getCreator(postDB.creator_id),
        postDB.comments_post
      );
      return post.toBusinessModel();
    });

    function getCreator(creatorId: string) {
      const creator = creatorsDB.find((creatorDB) => {
        return creatorDB.id === creatorId;
      });
      return {
        id: creator.id,
        name: creator.name,
      };
    }
    return posts;
  };

  public getPostsById = async (input: GetPostByIdInputDTO) => {
    const { id, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token' não informado!");
    }

    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError("'Token' inválido!");
    }

    const searchPostById = await this.postDatabase.getPostById(id);
    if (!searchPostById) {
      throw new BadRequestError("'Post' não localizado!");
    }

    const { postsDB, creatorsDB, commentsDB } =
      await this.postDatabase.getPostWithComments(id);

    const posts = postsDB.map((postDB) => {
      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.comments,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        getCreator(postDB.creator_id),
        getComments(postDB.id)
      );
      return post.toBusinessCommentsModel();
    });
    function getCreator(creatorId: string) {
      const creator = creatorsDB.find((creatorDB) => {
        return creatorDB.id === creatorId;
      });
      return {
        id: creator.id,
        name: creator.name,
      };
    }
    function getComments(postId: string): any {
      const comments = commentsDB.filter((commentDB) => {
        return commentDB.post_id === postId;
      });
      return comments;
    }
    return posts;
  };

  public createPost = async (input: CreatePostInputDTO) => {
    const { content, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token' não informado!");
    }
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError(" Token inválido!");
    }

    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const comments = 0;
    const likes = 0;
    const dislikes = 0;
    const creator_id = payload.id;

    if (content !== undefined) {
      if (typeof content !== "string") {
        throw new BadRequestError("'Content' precisa ser uma string!");
      }
    }

    const newPost = new Post(
      id,
      content,
      comments,
      likes,
      dislikes,
      created_at,
      updated_at,
      { id: creator_id, name: payload.name },
      {
        id: "",
        content: "",
        likes: 0,
        dislikes: 0,
        created_at: "",
        updated_at: "",
        post_id: "",
        creator: {
          creator_id: "",
          name: "",
        },
      }
    );

    const newPostDB = newPost.dBModel();
    await this.postDatabase.insertPost(newPostDB);

    const output = {
      message: "Post cadastrado com sucesso!",
      post: newPost,
    };
    return output;
  };

  public editPost = async (input: EditPostInputDTO) => {
    const { id, content, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token' não informado!");
    }
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("'Token' inválido!");
    }

    const filterPostToEdit = await this.postDatabase.getPostById(id);

    if (!filterPostToEdit) {
      throw new BadRequestError("'Id' não localizado!");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (filterPostToEdit.creator_id !== payload.id) {
        throw new BadRequestError("Você não possui autorização para editar! ");
      }
    }

    if (content !== undefined) {
      if (typeof content !== "string") {
        throw new BadRequestError("'Content' deve ser do tipo string!");
      }
    }

    const updatedAt = new Date().toISOString();

    const postToEdit = new Post(
      id,
      content,
      filterPostToEdit.comments,
      filterPostToEdit.likes,
      filterPostToEdit.dislikes,
      filterPostToEdit.created_at,
      updatedAt,
      {
        id: filterPostToEdit.creator_id,
        name: payload.name,
      },
      {
        id: "",
        content: "",
        likes: 0,
        dislikes: 0,
        created_at: "",
        updated_at: "",
        post_id: "",
        creator: {
          creator_id: "",
          name: "",
        },
      }
    );
    const postToEditDB = postToEdit.dBModel();
    await this.postDatabase.editPost(postToEditDB, id);

    const output = {
      message: "Atualização realizada com sucesso!",
      content: postToEdit,
    };
    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, id } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const findIdPost = await this.postDatabase.idFindPost(id);
    if (!findIdPost) {
      throw new NotFoundError("Id não localizado!");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== findIdPost.creator_id) {
        throw new ForbiddenError("Apenas quem criou o post, pode deleta-lo!");
      }
    }

    await this.postDatabase.deletePost(id);

    const output: DeletePostOutputDTO = {
      message: " Post deletado com sucesso!",
    };
    return output;
  };

  public likeOrDislike = async (input: LikeOrDislikeInputDTO) => {
    const { id, like, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token'não informado!");
    }
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new UnauthorizedError("'Token' inválido!");
    }

    const filterPostLike = await this.postDatabase.getPostById(id);
    const filterCommentLike = await this.postDatabase.getCommentId(id);
    const filterLikeDislike = await this.postDatabase.findLikeDislike(
      payload.id,
      id
    );

    if (filterLikeDislike) {
      throw new BadRequestError("Você já curtiu esta publicação!");
    }

    if (filterPostLike) {
      let likes = filterPostLike.likes;
      let dislikes = filterPostLike.dislikes;

      if (like === 0) {
        dislikes++;
      } else if (like === 1) {
        likes++;
      } else {
        throw new BadRequestError("Informe 1 para like, e 0 para dislike!");
      }

      const postLike = new Post(
        id,
        filterPostLike.content,
        filterPostLike.comments,
        likes,
        dislikes,
        filterPostLike.created_at,
        filterPostLike.updated_at,
        { id: filterPostLike.creator_id, name: "" },
        {
          id: "",
          content: "",
          likes: 0,
          dislikes: 0,
          created_at: "",
          updated_at: "",
          post_id: "",
          creator: {
            creator_id: "",
            name: "",
          },
        }
      );

      const editLikeDB = {
        user_id: payload.id,
        post_id: id,
        like: 1,
      };

      const postLikeDB = postLike.dBModel();
      await this.postDatabase.editPost(postLikeDB, id);
      await this.postDatabase.updateLikeDislike(editLikeDB);

      if (like === 0) {
        const output = {
          message: "'Dislike' recebido!",
        };
        return output;
      } else if (like === 1) {
        const output = {
          message: "'Like' recebido!",
        };
        return output;
      }
    }
    if (filterCommentLike) {
      let likes = 0;
      let dislikes = 0;

      if (like === 0) {
        dislikes = 1;
      } else if (like === 1) {
        likes = 1;
      } else {
        throw new BadRequestError("Informe 1 para like, e 0 para dislike!");
      }
      const comments = 0;

      const commentLike = new Post(
        id,
        filterCommentLike.content,
        comments,
        likes,
        dislikes,
        filterCommentLike.created_at,
        filterCommentLike.updated_at,
        { id: filterCommentLike.creator_id, name: "" },
        {
          id: "",
          content: "",
          likes: 0,
          dislikes: 0,
          created_at: "",
          updated_at: "",
          post_id: "",
          creator: {
            creator_id: "",
            name: "",
          },
        }
      );
      const editLikeDB = {
        user_id: payload.id,
        comment_id: id,
        like: 1,
      };

      const commentLikeDB = commentLike.dBModel();
      await this.postDatabase.editComment(commentLikeDB, id);
      await this.postDatabase.editLikeDislikeComment(editLikeDB);

      if (like === 0) {
        const output = {
          message: "'Dislike' recebido!",
        };
        return output;
      } else if (like === 1) {
        const output = {
          message: "'Like' recebido!",
        };
        return output;
      }
    }
  };

  public createComment = async (input: CreateCommentInputDTO) => {
    const { postId, content, token } = input;

    if (typeof token !== "string") {
      throw new BadRequestError("'Token' não informado!");
    }

    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError("Token inválido!");
    }

    const findPostById = await this.postDatabase.getPostById(postId);

    if (!findPostById) {
      throw new BadRequestError("Post não localizado!");
    }
    const id = this.idGenerator.generate();
    const created_at = new Date().toISOString();
    const updated_at = new Date().toISOString();
    const comments = 0;
    const likes = 0;
    const dislikes = 0;
    const creator_id = payload.id;

    if (content !== undefined) {
      if (typeof content !== "string") {
        throw new BadRequestError("'Content', deve ser string!");
      }
    } else {
      throw new BadRequestError("Insira o 'content'!");
    }
    const comment = new Post(
      id,
      content,
      comments,
      likes,
      dislikes,
      created_at,
      updated_at,
      { id: creator_id, name: payload.name },
      {
        id: "",
        content: "",
        likes: 0,
        dislikes: 0,
        created_at: "",
        updated_at: "",
        post_id: findPostById.id,
        creator: {
          creator_id: "",
          name: "",
        },
      }
    );
    const postUpdate = new Post(
      findPostById.id,
      findPostById.content,
      findPostById.comments + 1,
      findPostById.likes,
      findPostById.dislikes,
      findPostById.created_at,
      findPostById.updated_at,
      {
        id: findPostById.creator_id,
        name: "",
      },
      {
        id: "",
        content: "",
        likes: 0,
        dislikes: 0,
        created_at: "",
        updated_at: "",
        post_id: "",
        creator: {
          creator_id: "",
          name: "",
        },
      }
    );
    const newCommentDB = comment.commentModel();
    await this.postDatabase.insertComment(newCommentDB);
    const postUpdateDB = postUpdate.dBModel();
    await this.postDatabase.editPost(postUpdateDB, findPostById.id);

    const output = {
      message: " Publicação realizada com sucesso!",
    };
    return output;
  };
}
