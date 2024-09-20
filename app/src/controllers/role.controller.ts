import type { Request, Response, NextFunction } from "express";
import ServerResponse from "../responses/server.response";
import * as RoleService from "../services/role.service"


export async function getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
        const role = await RoleService.getRoleById(+req.params.id);
        new ServerResponse(role, 200).send(res)
    } catch (err) {
        next(err)
    }
}

export async function createRole(req: Request, res: Response, next: NextFunction) {
    try {
        const newRole = await RoleService.createRole(req.body);
        new ServerResponse(newRole, 201).send(res)
    } catch (err) {
        next(err)
    }
}

export async function addRoleToUser(req: Request, res: Response, next: NextFunction) {
    try{
        const user = +req.params.userid
        const role = +req.params.roleid
    
        const updated = await RoleService.addRoleToUser(user, role)
        new ServerResponse(updated, 200).send(res)  

    } catch(err) {
        next(err)
    }
}

export async function removeRoleFromUser(req: Request, res: Response, next: NextFunction) {
    try{
        const user = +req.params.userid
        const role = +req.params.roleid
    
        const deleted = await RoleService.removeRoleFromUser(user, role)
        new ServerResponse(deleted, 200).send(res)
    } catch(err) {
        next(err)
    }
}