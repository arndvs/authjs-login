
import * as z from "zod";
import { UserRole } from "@prisma/client";

// login user form schema
export const LoginSchema = z.object({
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

// reset user email form schema
export const ResetEmailSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
  });

// update user settings form schema
 // fields are optional because user can update only one field or multiple
export const SettingsSchema = z.object({

  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
// zod refine method to add custom validation to the schema
// password update is optional, but if new password is provided, password is required
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  // new password is optional, but if password is provided, new password is required
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  },
  // custom error message and path to the field
  {
    message: "Password is required!",
    path: ["password"]
  })
