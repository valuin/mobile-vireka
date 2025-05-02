import { betterAuth, LiteralUnion, Models } from "better-auth";
import { v4 as uuidv4 } from "uuid";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { openAPI } from "better-auth/plugins";
import * as schema from "../db/schema";

type auth = ReturnType<typeof betterAuth>;

export const createAuth = (env: any): auth => {
  const db = getDb(env);
  const secret = env.BETTER_AUTH_SECRET;
  const baseUrl = env.BETTER_AUTH_URL;

  return betterAuth({
    secret: secret,
    baseUrl: baseUrl,

    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        ...schema,
        user: schema.users,
      },
    }),
    advanced: {
      generateId: ((options: {
        model: LiteralUnion<Models, string>;
        size?: number;
      }) => {
        return uuidv4();
      }) as
        | ((options: {
            model: LiteralUnion<Models, string>;
            size?: number;
          }) => string)
        | false
        | undefined,
      defaultFindManyLimit: 100,
    },
    emailAndPassword: {
      enabled: true,
    },
    plugins: [openAPI()],
  });
};

export default createAuth as (env: any) => auth;
