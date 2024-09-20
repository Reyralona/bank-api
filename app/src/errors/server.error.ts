export default class ServerError extends Error {
    constructor(public cause: string | object, public status: number) {
        super("Server Error")
        this.cause = cause
        this.status = status
    }

    public toJson(){
        return {
            message: this.message,
            status: this.status,
            cause: this.cause
        }
    }
}