import { Router } from "express";
import passport from "passport";
import "../strategies/local.strategy"
import ServerResponse from "../responses/server.response";
import Authenticate from "../middlewares/auth";
import Authorize from "../middlewares/authorize";

import * as UserController from "../controllers/user.controller"
import * as RoleController from "../controllers/role.controller"
import * as AccountController from "../controllers/account.controller"
import type { User } from "@prisma/client";
import prisma from "../database";

const router = Router()

router.post("/auth", passport.authenticate("local"), Authenticate, (req, res, next) => {
    try{
        console.log(req.user)
        new ServerResponse("Authenticaded successfully", 200).send(res)
    } catch(err) {
        next(err)
    }
});

router.get("/auth/validate", Authenticate, (req, res, next) => {
    try{
        const user = req.user as User
        new ServerResponse(user, 200).send(res)
    } catch(err) {
        next(err)
    }
})

router.get("/auth/dashboard", Authenticate, Authorize, async (req, res, next) => {
    const numUsers = await prisma.user.count()
    const numAccounts = await prisma.bankAccount.count()
    const transactions = await prisma.bankLogs.count()
    const totalBalance = (await prisma.bankAccount.aggregate({
        _sum: {
            Balance: true
        }
    }))._sum.Balance

    new ServerResponse({
        numUsers, numAccounts, transactions, totalBalance
    }, 200).send(res)


})

// users
router.get("/auth/user/:id", Authenticate, Authorize, UserController.getUserById)
router.post("/auth/user", Authenticate, Authorize, UserController.createUser)
router.delete("/auth/user/:id", Authenticate, Authorize, UserController.deleteUser)


// roles
router.get("/auth/role/:id", Authenticate, Authorize, RoleController.getRoleById)
router.post("/auth/role", Authenticate, Authorize, RoleController.createRole)
router.put("/auth/role/user/:userid/role/:roleid", Authenticate, Authorize, RoleController.addRoleToUser)
router.delete("/auth/role/user/:userid/role/:roleid", Authenticate, Authorize, RoleController.removeRoleFromUser)   


// accounts (user)
router.get("/auth/account/me", Authenticate, AccountController.userGetAccounts)
router.get("/auth/account/me/balance/:bankaccountid", Authenticate, AccountController.getUserBalance)
router.post("/auth/account/me/withdraw", Authenticate, AccountController.userWithdraw)
router.post("/auth/account/me/deposit", Authenticate, AccountController.userDeposit)
router.post("/auth/account/me/transfer", Authenticate, AccountController.userTransferFunds)

// accounts (ADMIN)
router.get("/auth/account/:id", Authenticate, Authorize, AccountController.getAccountById)
router.post("/auth/account", Authenticate, Authorize, AccountController.createAccount)
router.delete("/auth/account/:id", Authenticate, Authorize, AccountController.deleteAccount)



export default router