import type { User } from "@prisma/client";
import prisma from "../database";
import ServerError from "../errors/server.error";
import { hashPassword } from "../utils/password";
import { createUserSchema } from "../schemas/createuser.schema";

export async function getUserById(userId: number): Promise<User> {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) throw new ServerError("User not found", 404)

    return user

}

export async function userExists(userId: number): Promise<boolean> {
    const user = await getUserById(userId);
    if (!user) return false
    return true
}

export async function createUser(user: User): Promise<User> {

    const parseResult = createUserSchema.safeParse(user)
    if (parseResult.error)
        throw new ServerError(JSON.parse(parseResult.error.message), 400)

    const parsedUser: Omit<User, "id"> = parseResult.data

    const hash = await hashPassword(parsedUser.password)
    parsedUser.password = hash.password

    const [newUser] = await prisma.$transaction([
        prisma.user.create({
            data: parsedUser
        })
    ])

    if (!newUser) throw new ServerError("Failed to create user", 500)

    return newUser
}

export async function deleteUser(userId: number): Promise<User> {

    if (!await userExists(userId)) throw new ServerError("User not found", 404)

    const [deleted] = await prisma.$transaction([
        prisma.user.delete({
            where: {
                id: userId
            },
            include: {
                UserRole: true
            }
        })
    ])

    if (!deleted) throw new ServerError("Failed to delete user", 500)

    return deleted
}  