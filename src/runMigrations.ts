import "dotenv/config";
import knexConfig from "./database/knexfile";
import { knex as Knex } from "knex";

async function runMigrations() {
  // Create Knex instance using the development config
  const knex = Knex(knexConfig.development);

  try {
    console.log("Running migrations...");
    await knex.migrate.latest();
    console.log("✅ Migrations finished successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await knex.destroy();
  }
}

runMigrations();
