import { z } from "zod"

export const createRoleSchema = z.object({
    rolename: z.string().min(3).max(20)
    .regex(/^[A-Z][A-Z_]*$/, 
        { 
            message: "String must start with an uppercase letter and only contain uppercase letters and underscores" 
        }
    )
})