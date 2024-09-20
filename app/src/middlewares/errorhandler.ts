import type { NextFunction, Request, Response } from "express"
import ServerError from "../errors/server.error"

export default function ErrorHandler(err: Error | ServerError, req: Request, res: Response, next: NextFunction) { 
    if (err instanceof ServerError) {
        res.status(err.status).json(err.toJson())
    }
    else {
        res.status(500).json({
            message: err.message,
            name: err.name,
            stack: err.stack
        })
    }
}