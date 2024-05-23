import { Elysia } from "elysia";

import meRouter from "./me";

export default new Elysia({ prefix: "/account" })
    .use(meRouter)