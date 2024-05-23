import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

import apiRouter from "./routes";

const app = new Elysia()
  .use(apiRouter)
  .use(swagger())
  .listen(3000);

console.log(
  `🦊 Swagger is running at ${app.server?.hostname}:${app.server?.port}/swagger`
);

export type App = typeof app;