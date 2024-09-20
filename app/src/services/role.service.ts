import type { Role, UserRole } from "@prisma/client";
import prisma from "../database";
import ServerError from "../errors/server.error";
import { createRoleSchema } from "../schemas/createrole.schema";

export async function addRoleToUser(userid: number, roleid: number): Promise<UserRole> {
    
    const updated = await prisma.userRole.create({
        data: {
            userId: userid,
            roleId: roleid
        }
    })

    return updated;
}

export async function removeRoleFromUser(userid: number, roleid: number): Promise<UserRole> {
    const deleted = await prisma.userRole.delete({
        where: {    
            roleId_userId: {
                roleId: roleid,
                userId: userid
            }
        }
    })

    return deleted;

}

export async function getRoleById(roleid: number): Promise<Role> {

    const role = await prisma.role.findUnique({
        where: {id: roleid}
    });

    if (!role) throw new ServerError("Role not found", 404);

    return role;

}

export async function createRole(role: Role): Promise<Role> {

    const parsedResult = createRoleSchema.safeParse(role);
    if (parsedResult.error) 
        throw new ServerError(JSON.parse(parsedResult.error.message), 400);

    const parsedRole = parsedResult.data

    const newRole = await prisma.role.create({
        data: parsedRole
    });

    return newRole;
 
}

