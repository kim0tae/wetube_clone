import express from "express"
import { getEdit, postEdit, remove, see, logout, startGithubLogin, finishGithubLogin } from '../controllers/userController'
import { proectedMiddleware, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", proectedMiddleware,logout);
userRouter.route("/edit").all(proectedMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);


export default userRouter;