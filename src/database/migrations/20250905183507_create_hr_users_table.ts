import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("hr_users", (table) => {
    table.increments("id").primary();
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the hr_users table if needed (for rollback)
  await knex.schema.dropTableIfExists("hr_users");
}
