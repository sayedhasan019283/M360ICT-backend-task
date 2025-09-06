import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("attendance", (table) => {
    table.increments("id").primary(); // Primary key, auto-increment
    table.integer("employee_id").unsigned().notNullable(); // Foreign key reference to employees table
    table.date("date").notNullable(); // The date of attendance
    table.timestamp("check_in_time").notNullable(); // Check-in time (timestamp)

    // Foreign key constraint
    table.foreign("employee_id").references("id").inTable("employees").onDelete("CASCADE");

    // Unique constraint on (employee_id, date)
    table.unique(["employee_id", "date"]);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("attendance");
}
