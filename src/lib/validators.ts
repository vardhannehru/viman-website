import { z } from "zod";

/**
 * The source shows a single authentication screen with Username, Password,
 * "Log in" and "Create". It specifies no password rules, no email field and no
 * separate sign-up form, so nothing beyond "required" is enforced here.
 */
export const logInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LogInValues = z.infer<typeof logInSchema>;
