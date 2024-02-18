import * as z from "zod";

// login form schema
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

// register new user form schema
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

// reset password form schema
export const ResetSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
  });
