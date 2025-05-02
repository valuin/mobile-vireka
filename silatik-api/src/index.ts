import { Hono } from "hono";
import { createAuth } from "./utils/auth";
import { cors } from "hono/cors";
import { betterAuth } from "better-auth";

type auth = ReturnType<typeof betterAuth>;

export type VarBindings = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

export type Variables = {
  auth: auth;
};

const app = new Hono<{
  Bindings: VarBindings;
  Variables: Variables;
}>();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
  async (c, next) => {
    const auth = createAuth(c.env);
    c.set("auth", auth as any);
    await next();
  }
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return c.get("auth").handler(c.req.raw);
});

export default app;
