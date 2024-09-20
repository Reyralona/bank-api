import passport from "passport"
import prisma from "../database"
import { Strategy } from "passport-local"
import type { User } from "@prisma/client";
import { comparePassword } from "../utils/password";

passport.serializeUser((user: User, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: id}
        })
        done(null, user);
    } catch(err) {
        done(err, null);
    }

})

passport.use(
    new Strategy({}, async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username }
            })
            if (!user) throw new Error("User not found")
            if (!await comparePassword(password, user.password)) throw new Error("Password mismatch")

            done(null, user)

        } catch (err) {
            done(err)
        }

    })
)
