import { Knex } from "knex";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      database: process.env.PG_DATABASE || "m360ict_task_DB",
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASSWORD || "Sayed15924",
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "m360ict_hr",
      user: "postgres",
      password: "Sayed15924",
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: "localhost",
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: { min: 2, max: 10 },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
  },
};

export default knexConfig;
