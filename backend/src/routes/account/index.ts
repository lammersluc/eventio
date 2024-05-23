import { Elysia, t } from "elysia";

import { loginService , loginValidation} from "@/services/account";

export default new Elysia({ prefix: "/account" })
    .post('/login', loginService, loginValidation)