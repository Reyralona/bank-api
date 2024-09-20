import express from "express"
import path from "node:path"
import session from "express-session"
import passport from "passport"
import Authenticate from "./middlewares/auth"
import ErrorHandler from "./middlewares/errorhandler"
import router from "./routes"

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.join(__dirname, "public")))
app.use(
    session({
        secret: process.env.SECRET as string,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60) * 60,
            httpOnly: false
        }
    })
)
app.use(passport.initialize())
app.use(passport.session())

app.use("/api", router)

app.use(ErrorHandler)

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})