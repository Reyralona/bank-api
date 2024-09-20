import prisma from "../database";

export async function logTransaction(message: string, success: boolean): Promise<void> {
    await prisma.bankLogs.create({
        data: {
            message,
            success
        }
    })
}
