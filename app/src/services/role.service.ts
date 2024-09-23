import type { Role, UserRole } from "@prisma/client";
import prisma from "../database";
import ServerError from "../errors/server.error";
import { createRoleSchema } from "../schemas/createrole.schema";


export async function userHasRole(userid: number, roleid: number): Promise<boolean> {

    const userRoles = await prisma.userRole.findMany({
        where: {
            userId: userid,
            roleId: roleid
        }
    })

    if (userRoles.length > 0)
        return true
    return false
}

export async function addRoleToUser(userid: number, roleid: number): Promise<UserRole> {

    // checks if user has role already
    if (await userHasRole(userid, roleid)) throw new ServerError("User already has role", 400)


    const [updated] = await prisma.$transaction([
        prisma.userRole.create({
            data: {
                userId: userid,
                roleId: roleid
            }
        })
    ])

    if (!updated) throw new ServerError("Failed to add role", 500)

    return updated;
}

export async function removeRoleFromUser(userid: number, roleid: number): Promise<UserRole> {

    if (!await userHasRole(userid, roleid)) throw new ServerError("User does not have role", 400)


    const [deleted] = await prisma.$transaction([
        prisma.userRole.delete({
            where: {
                roleId_userId: {
                    roleId: roleid,
                    userId: userid
                }
            }
        })
    ])

    if (!deleted) throw new ServerError("Failed to delete role", 500)

    return deleted;

}

export async function getRoleById(roleid: number): Promise<Role> {

    const role = await prisma.role.findUnique({
        where: { id: roleid }
    });

    if (!role) throw new ServerError("Role not found", 404);

    return role;

}

export async function createRole(role: Role): Promise<Role> {

    const parsedResult = createRoleSchema.safeParse(role);
    if (parsedResult.error)
        throw new ServerError(JSON.parse(parsedResult.error.message), 400);

    const parsedRole = parsedResult.data

    const [newRole] = await prisma.$transaction([
        prisma.role.create({
            data: parsedRole
        })
    ])

    if (!newRole)
        throw new ServerError("Failed to create role", 500)


    return newRole;

}

