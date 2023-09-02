import { z } from "zod";

export interface EditPostInputDTO {
  id: string;
  content: string;
  token: string;
}

export interface EditPostOutputDTO {
  message: string;
  content: string;
}

export const EditPostSchema = z
  .object({
    id: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as EditPostInputDTO);
