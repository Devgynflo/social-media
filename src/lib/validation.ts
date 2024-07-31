import { z } from "zod";

const requiredString = z.string().trim().min(1, "Requis");

export const signUpSchema = z.object({
  email: requiredString.email("Adresse Email invalide"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_]+$/,
    "Seuls les caractères alphanumériques et les tirets sont autorisés",
  ),
  password: requiredString.min(8, "8 caractères minimum"),
});

export const signInSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export const createPostSchema = z.object({
  content: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
