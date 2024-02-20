import * as z from "zod";

// login user form schema
export const LoginUserSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
    code: z.optional(z.string()), // 2FA code is string or null
});

// set new user password form schema
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  });


// register new user form schema
export const RegisterUserSchema = z.object({
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

// reset user email form schema
export const ResetEmailSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
  });
