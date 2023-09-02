import { z } from "zod";
import { UserModel } from "../../models/User";

export interface GetUsersByIdInputDTO {
  id: string;
  token: string;
}

export type GetUsersByIdOutputDTO = UserModel[];

export const GetUsersByIdSchema = z
  .object({
    id: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as GetUsersByIdInputDTO);
