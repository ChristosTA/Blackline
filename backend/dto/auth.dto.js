import { z } from "zod";

export const SignUpDto = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
