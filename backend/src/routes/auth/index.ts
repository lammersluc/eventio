import { Elysia } from "elysia";

import loginRouter from "./login";
import registerRouter from "./register";
import jwt from "@elysiajs/jwt";

export default new Elysia({ prefix: "/auth" })
    .use(loginRouter)
    .use(registerRouter)
    .use(jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET!,
        exp: process.env.JWT_EXP
    }))