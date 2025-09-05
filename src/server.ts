import "dotenv/config";
import colors from "colors";
import { Server } from "socket.io";
import app from "./app";
import { errorLogger, logger } from "./shared/logger";
import { socketHelper } from "./app/socket/socket";
import knexConfig from "./database/knexfile"; // ✅ renamed import
import { knex as Knex } from "knex";
import envConfig from "./config"; // your env config

// Create Knex instance using the development environment
const knex = Knex(knexConfig.development);

// Uncaught exception
process.on("uncaughtException", (error) => {
  errorLogger.error("Unhandled Exception Detected", error);
  process.exit(1);
});

let server: any;

async function main() {
  try {
    // Test PostgreSQL connection
    await knex.raw("SELECT 1+1 AS result");
    logger.info(colors.green("🚀 PostgreSQL connected successfully via Knex"));

    const port = envConfig.port || 3000;
    server = app.listen(port, "localhost", () => {
      logger.info(
        colors.yellow(`♻️ Application listening on http://localhost:${port}/test`)
      );
    });

    // Socket.io setup
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: { origin: "*" },
    });
    socketHelper.socket(io);
    // @ts-ignore
    global.io = io;
  } catch (error) {
    errorLogger.error(colors.red("🤢 Failed to connect to PostgreSQL"), error);
  }

  process.on("unhandledRejection", async (error) => {
    errorLogger.error("UnhandledRejection Detected", error);
    if (server) {
      server.close(async () => {
        try {
          await knex.destroy();
        } finally {
          process.exit(1);
        }
      });
    } else {
      process.exit(1);
    }
  });
}

// SIGTERM handling
process.on("SIGTERM", async () => {
  logger.info("SIGTERM RECEIVED");
  if (server) {
    server.close(async () => {
      await knex.destroy();
      process.exit(0);
    });
  } else {
    await knex.destroy();
    process.exit(0);
  }
});

main();
