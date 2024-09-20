import type { User } from "@prisma/client";
import prisma from "../database";
import ServerError from "../errors/server.error";
import { hashPassword } from "../utils/password";
import { createUserSchema } from "../schemas/createuser.schema";

export async function getUserById(userid: number): Promise<User> {

    const user = await prisma.user.findUnique({
        where: {
            id: userid
        }
    })

    if (!user) throw new ServerError("User not found", 404)

    return user

}

export async function createUser(user: User): Promise<User> {

    const parseResult = createUserSchema.safeParse(user)
    if(parseResult.error)
        throw new ServerError(JSON.parse(parseResult.error.message), 400)
    
    const parsedUser: Omit<User, "id"> = parseResult.data

    const hash = await hashPassword(parsedUser.password)
    parsedUser.password = hash.password

    const newUser = await prisma.user.create({
        data: parsedUser
    })

    return newUser
}

export async function deleteUser(userid: number): Promise<User> {
    const deleted = await prisma.user.delete({
        where: {
            id: userid
        },
        include: {
            UserRole: true
        }
    })

    return deleted
}  