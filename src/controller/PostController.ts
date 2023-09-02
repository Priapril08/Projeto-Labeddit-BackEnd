import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { CreatePostSchema } from "../dtos/post/createPost.dto";
import { PostBusiness } from "../business/PostBusiness";
import {
  DeletePostOutputDTO,
  DeletePostSchema,
} from "../dtos/post/deletePost.dto";
import { LikeOrDislikePostSchema } from "../dtos/post/likeOrDislike.dto";
import {
  CreateCommentOutputDTO,
  CreateCommentSchema,
} from "../dtos/post/createComment.dto";
import { EditPostSchema } from "../dtos/post/editPost.dto";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = {
        q: req.query.q as string,
        token: req.headers.authorization as string,
      };
      const output = await this.postBusiness.getPosts(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado!");
      }
    }
  };

  public getPostById = async (req: Request, res: Response) => {
    try {
      const input = {
        id: req.params.id as string,
        token: req.headers.authorization as string,
      };
      const output = await this.postBusiness.getPostsById(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado!");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.createPost(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        id: req.params.id,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.editPost(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        id: req.params.id,
        token: req.headers.authorization,
      });
      const output: DeletePostOutputDTO = await this.postBusiness.deletePost(
        input
      );
      res.status(200).send(output);
      console.log(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public likeOrDislike = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        id: req.params.id,
        like: req.body.like,
        token: req.headers.authorization as string,
      });
      console.log(input);

      const output = await this.postBusiness.likeOrDislike(input);

      res.status(200).send(output);
      console.log(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        postId: req.params.id,
        content: req.body.content,
        token: req.headers.authorization as string,
      });
      console.log(input);

      const output: CreateCommentOutputDTO =
        await this.postBusiness.createComment(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };
}
