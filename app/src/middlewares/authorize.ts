import type { NextFunction, Request, Response } from "express";
import prisma from "../database";
import { server } from "typescript";
import ServerError from "../errors/server.error";

export default async function Authorize(req: Request, res: Response, next: NextFunction) {
    try {
        const roles = await prisma.userRole.findMany({
            where: { userId: req.user.id },
            include: {
                role: {
                    select: { rolename: true }
                }
            }
        });

        const roleNames = roles.map((role) => role.role.rolename);

        if (!roleNames.includes("ADMIN")) {
            throw new ServerError("Unauthorized", 401)
        }

        next()
        
    } catch (err) {
        next(err)
    }


}