import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ["info", "query", "error", "warn"],
})
export default prisma