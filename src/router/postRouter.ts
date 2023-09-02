import express from "express";
import { PostController } from "../controller/PostController";
import { PostBusiness } from "../business/PostBusiness";
import { PostDatabase } from "../database/PostDataBase";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const postRouter = express.Router();

const postController = new PostController(
  new PostBusiness(
    new PostDatabase(),
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

postRouter.get("/", postController.getPosts);
postRouter.get("/:id", postController.getPostById);

postRouter.post("/", postController.createPost);
postRouter.post("/:id", postController.createComment);

postRouter.put("/:id", postController.editPost);

postRouter.delete("/:id", postController.deletePost);

postRouter.put("/:id/like", postController.likeOrDislike);