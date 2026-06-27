import { buildServer } from "./server.js";

const app = await buildServer();
await app.listen({ host: "0.0.0.0", port: app.config.PORT });

async function shutdown(signal: string) {
  app.log.info({ signal }, "shutting down");
  await app.close();
  process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
