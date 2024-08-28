import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.string(),
  UPLOADTHING_SECRET: z.string(),
  NEXT_PUBLIC_UPLOADTHING_APP_ID: z.string(),
  CRON_SECRET: z.string(),
  NEXT_PUBLIC_STREAM_KEY: z.string(),
  STREAM_SECRET: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
