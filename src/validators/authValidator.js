
import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");

const nameSchema = z.string()
    .min(3, "Name must be more than 2 characters long")
    .regex(/^[^0-9]*$/, "Name should not contain numbers");

const emailSchema = z.string()
    .email("Invalid email address");

export const registerSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
});
