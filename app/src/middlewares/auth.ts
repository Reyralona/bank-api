import type { Request, Response, NextFunction } from "express"
import ServerError from "../errors/server.error"
export default function Authenticate(req: Request, res: Response, next: NextFunction) {
    try{
        const user = req.user
        if (!user) throw new ServerError("Unauthenticated user", 401)
        next()
    } catch(err) {
        next(err)
    }
}