import { Router } from "express";
import ServerResponse from "../responses/server.response";
import Authorize from "../middlewares/auth";

const userRouter = Router();


userRouter.get("/", Authorize, (req, res) => {
    // new ServerResponse("User route", 200).send(res);
});

export default userRouter