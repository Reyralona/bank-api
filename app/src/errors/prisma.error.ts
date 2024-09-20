export default class PrismaError extends Error {
    constructor(public cause: string, public status: number) {
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