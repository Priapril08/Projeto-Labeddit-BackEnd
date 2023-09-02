import { z } from "zod";

export interface LikeOrDislikeInputDTO {
  id: string;
  like: number;
  token: string;
}

export type LikeOrDislikeOutputDTO = undefined;

export const LikeOrDislikePostSchema = z
  .object({
    id: z.string().min(1),
    like: z.number(),
    token: z.string().min(1),
  })
  .transform((data) => data as LikeOrDislikeInputDTO);
