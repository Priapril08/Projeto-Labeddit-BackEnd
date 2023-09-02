import { z } from "zod";
import { PostModel } from "../../models/Post";

export interface GetPostsInputDTO {
  q: string;
  token: string;
}
export interface GetPostsOutputDTO {
  message: PostModel[];
}

export const GetPostsSchema = z
  .object({
    q: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as GetPostsInputDTO);
