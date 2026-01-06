import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const fecthUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const updateUserSchema = z
  .object({
    email: z.email("Invalid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type FetchUsersQueryDto = z.infer<typeof fecthUsersQuerySchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;