import type { NextFunction, Request, Response } from "express";
import ServerResponse from "../responses/server.response";
import * as AccountService from "../services/account.service"
import { logTransaction } from "../services/logging.service";
import type { User } from "@prisma/client";

export async function getAccountById(req: Request, res: Response, next: NextFunction){
    try{
        const accountId = req.params.id
        const account = await AccountService.getAccountById(accountId);
        new ServerResponse(account, 200).send(res)
    } catch(err) {
        next(err)
    }
}
export async function createAccount(req: Request, res: Response, next: NextFunction){
    try{
        const newAccount = await AccountService.createAccount(req.body);
        new ServerResponse(newAccount, 201).send(res)
    } catch(err) {
        next(err)
    }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction){
    try{
        await AccountService.deleteAccount(req.params.id);
        new ServerResponse("Account deleted successfully", 200).send(res)
    } catch(err) {
        next(err)
    }
}

export async function userGetAccounts(req: Request, res: Response, next: NextFunction){
    try{
        const user = req.user as User
        const accounts = await AccountService.userGetAccounts(user.id);
        new ServerResponse(accounts, 200).send(res)
    } catch(err) {
        next(err)
    }
}

export async function getUserBalance(req: Request, res: Response, next: NextFunction){
    try{
        const user = req.user as User
        const balance = await AccountService.getUserBalance(
            user.id, req.params.bankaccountid
        );
        new ServerResponse({
            "message": "Balance fetched successfully",
            "balance": balance
        }, 200).send(res)
    } catch(err) {
        next(err)
    }
}
export async function userWithdraw(req: Request, res: Response, next: NextFunction){

    const user = req.user as User
    const logString = `User ${user.id} withdrew ${req.body.amount} from account ${req.body.bankAccountId}`

    try{
        const withdraw = await AccountService.userWithdraw(
            user.id, req.body.bankAccountId, req.body.amount
        );
        new ServerResponse({
            "message": "Withdrawal successful",
            "amount": withdraw
        }, 200).send(res)

        await logTransaction(logString, true)
    } catch(err) {
        await logTransaction(logString, false)
        next(err)
    }
}
export async function userDeposit(req: Request, res: Response, next: NextFunction){

    const user = req.user as User
    const logString = `User ${user.id} deposited ${req.body.amount} into account ${req.body.bankAccountId}`

    try{
        const deposit = await AccountService.userDeposit(
            user.id, req.body.bankAccountId, req.body.amount
        );
        new ServerResponse({
            "message": "Deposit successful",
            "amount": deposit
        }, 200).send(res)

        await logTransaction(logString, true)
    } catch(err) {
        await logTransaction(logString, false)
        next(err)
    }
}

export async function userTransferFunds(req: Request, res: Response, next: NextFunction){

    const user = req.user as User
    const logString = `User ${user.id} transferred ${req.body.amount} from account ${req.body.fromId} to account ${req.body.toId}`
    
    try{
        const userId = user.id
        const { fromId, toId, amount } = req.body
        await AccountService.userTransferFunds(
            userId, fromId, toId, Number( amount )
        )

        new ServerResponse({
            "message": "Transfer successful",
            "from": fromId,
            "to": toId,
            "amount": amount
        }, 200).send(res)

        await logTransaction(logString, true)
    } catch(err) {
        await logTransaction(logString, false)
        next(err)
    }
}
