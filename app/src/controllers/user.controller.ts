import type { Request, Response, NextFunction } from "express";
import ServerResponse from "../responses/server.response";
import * as UserService from "../services/user.service"

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.getUserById(Number(req.params.id));
        new ServerResponse(user, 200).send(res)
    } catch (err) {
        next(err)
    }
}


export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const newUser = await UserService.createUser(req.body);
        new ServerResponse(newUser, 201).send(res)
    } catch (err) {
        next(err)
    }

}


export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const deleted = await UserService.deleteUser(Number(req.params.id));
        new ServerResponse(deleted, 200).send(res) 
    } catch (err) {
        next(err)
    }
}