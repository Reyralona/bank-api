import { z } from "zod"

export const createUserSchema = z.object({
    username: z.string().min(8).max(50),
    useremail: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one symbol" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
})