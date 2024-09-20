import type { Response } from "express"

export default class ServerResponse {
    constructor(public message: string | object, public status: number) {
        this.message = message
        this.status = status
    }

    public toJson() {
        return {
            message: this.message,
            status: this.status
        }
    }

    public send(res: Response){
        const responseObject = new ServerResponse(this.message, this.status)
        res.status(this.status).json(responseObject.toJson())
    }
}

