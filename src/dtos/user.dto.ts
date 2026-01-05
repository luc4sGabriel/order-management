import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const fecthUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type FetchUsersQueryDto = z.infer<typeof fecthUsersQuerySchema>;