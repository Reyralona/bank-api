import type { BankAccount } from "@prisma/client";
import prisma from "../database";
import ServerError from "../errors/server.error";
import { MAX_BANKACCOUNTS_PER_USER } from "../constants";

export async function getAccountById(bankAccountId: string): Promise<BankAccount> {
    const account = await prisma.bankAccount.findUnique({
        where: {
            id: bankAccountId
        }
    })

    if (!account) throw new ServerError("Account not found", 404)

    return account

}
export async function createAccount(bankAccount: BankAccount): Promise<BankAccount> {

    // check if user has max accounts
    if (await prisma.bankAccount.count(
        { where: { ownerId: bankAccount.ownerId } }) >= MAX_BANKACCOUNTS_PER_USER
    )
        throw new ServerError(`User cannot have more than ${MAX_BANKACCOUNTS_PER_USER} accounts`, 400)

    const newAccount = await prisma.bankAccount.create({
        data: bankAccount
    })

    return newAccount
}

export async function deleteAccount(bankAccountId: string): Promise<BankAccount> {
    const deletedAccount = await prisma.bankAccount.delete({
        where: {
            id: bankAccountId
        }
    })

    if (!deletedAccount) throw new ServerError("Account not found", 404)

    return deletedAccount
}

export async function userGetAccounts(userId: number): Promise<BankAccount[]> {
    const accounts = await prisma.bankAccount.findMany({
        where: {
            ownerId: userId
        }
    })

    if (accounts.length === 0) throw new ServerError("No accounts for user", 404)

    return accounts
}

export async function getUserBalance(userId: number, bankAccountId: string): Promise<number> {
    const account = await getAccountById(bankAccountId)
    if (account.ownerId !== userId) throw new ServerError("Account not found for user", 404)
    const balance = account.Balance
    return balance
}

export async function userDeposit(userId: number, bankAccountId: string, amount: number): Promise<number> {

    const account = await getAccountById(bankAccountId)
    // user has to be owner
    if (userId !== account.ownerId) throw new ServerError("Account not found for user", 404)

    // minimum deposit is 5
    if (amount < 5) throw new ServerError("Minimum deposit is 5", 400)

    const newBalance = account.Balance + amount

    const [transaction] = await prisma.$transaction([
        prisma.bankAccount.update({
            where: {
                id: bankAccountId,
                ownerId: userId
            },
            data: {
                Balance: newBalance
            }
        })
    ])

    if (!transaction) throw new ServerError("Transaction failed", 500)

    return newBalance


}
export async function userWithdraw(userId: number, bankAccountId: string, amount: number): Promise<number> {
    // cannot withdraw more than balance

    const account = await getAccountById(bankAccountId)
    console.log(account)
    if (userId !== account.ownerId) throw new ServerError("Account not found for user", 404)

    // minimum withdraw is 5
    if (amount < 5) throw new ServerError("Minimum withdraw is 5", 400)
    if (amount > account.Balance) throw new ServerError("Cannot withdraw more than balance", 400)

    const newBalance = account.Balance - amount
    const [transaction] = await prisma.$transaction([
        prisma.bankAccount.update({
            where: {
                id: bankAccountId,
                ownerId: userId
            },
            data: {
                Balance: newBalance
            }
        })
    ])

    if(!transaction) throw new ServerError("Transaction failed", 500)

    return newBalance

}

export async function userTransferFunds(userId: number, fromId: string, toId: string, amount: number) {
    
    
    // can transfer to any account, from owners account
    const fromAccount = await getAccountById(fromId)
    if (userId !== fromAccount.ownerId) throw new ServerError("Account not found for user", 404)
    const toAccount = await getAccountById(toId)
    
    
    // cannot transfer to yourself
    if (fromId === toId) throw new ServerError("Must transfer to another account", 400)
    // minimum transfer is 5
    if (amount < 5) throw new ServerError("Minimum transfer is 5", 400)    
    // cannot transfer more than balance
    if (fromAccount.Balance < amount) throw new ServerError("Insufficient funds", 400)


    const [transaction] = await prisma.$transaction([
        // withdraw from source
        prisma.bankAccount.update({
            where: {
                id: fromId,
                ownerId: userId
            },
            data: {
                Balance: fromAccount.Balance - amount
            }
        }),
        // deposit into destiny
        prisma.bankAccount.update({
            where: {
                id: toId
            },
            data: {
                Balance: toAccount.Balance + amount
            }
        })
    ])

    if(!transaction) throw new ServerError("Transaction failed", 500)
        
}
