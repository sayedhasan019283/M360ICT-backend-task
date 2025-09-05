import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("employees", (table) => {
    table.increments("id").primary(); // primary key, auto-increment
    table.string("name").notNullable();
    table.integer("age").notNullable(); // age column
    table.string("designation").notNullable();
    table.date("hiring_date").notNullable();
    table.date("date_of_birth").notNullable();
    table.decimal("salary", 12, 2).notNullable(); // numeric/decimal with precision
    table.string("photo_path"); // optional
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("employees");
}
