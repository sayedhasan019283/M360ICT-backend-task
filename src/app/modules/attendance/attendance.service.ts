import { knex as Knex } from 'knex';  // Knex initialization
import { Attendance } from "./attendance.interface"; // Assuming the interface is defined
import { StatusCodes } from "http-status-codes"; // For HTTP status codes
import knexConfig from '../../../database/knexfile';

// Select the correct environment (development, staging, production)
const knex = Knex(knexConfig.development);
export class AttendanceService {
  private table = "attendance"; // Attendance table name

  // Get all attendance entries (with optional filters)
  public async getAll(filters: { employee_id?: number; date?: string; range?: { start: string; end: string } }): Promise<Attendance[]> {
    let query = knex(this.table).select("*");

    // Apply filters
    if (filters.employee_id) {
      query = query.where("employee_id", filters.employee_id);
    }

    if (filters.date) {
      query = query.where("date", filters.date);
    }

    if (filters.range) {
      query = query.whereBetween("date", [filters.range.start, filters.range.end]);
    }

    return query;
  }

  // Get a single attendance entry by id
  public async getById(id: number): Promise<Attendance | null> {
    return knex(this.table).where({ id }).first();
  }

  // Create or upsert attendance
  public async upsert(data: Attendance): Promise<Attendance> {
    // Try to find if the record exists (by employee_id and date)
    const existingRecord = await knex(this.table).where({
      employee_id: data.employee_id,
      date: data.date,
    }).first();

    if (existingRecord) {
      // If it exists, update check_in_time
      await knex(this.table)
        .where({ id: existingRecord.id })
        .update({ check_in_time: data.check_in_time, updated_at: knex.fn.now() });

      return { ...existingRecord, check_in_time: data.check_in_time };
    }

    // If it doesn't exist, create a new attendance record
    const [newRecord] = await knex(this.table)
      .insert(data)
      .returning("*");

    return newRecord;
  }

  // Update an attendance entry by id
  public async update(id: number, data: Partial<Attendance>): Promise<Attendance | null> {
    const updated = await knex(this.table)
      .where({ id })
      .update(data)
      .returning("*");

    return updated[0] || null;
  }

  // Delete an attendance entry by id
  public async delete(id: number): Promise<void> {
    await knex(this.table).where({ id }).del();
  }
    // Monthly attendance report
  public async getMonthlyAttendanceReport(month: string, employee_id?: number): Promise<any[]> {
    const startOfMonth = `${month}-01`;
    const endOfMonth = `${month}-31`; // Handle months with less than 31 days in the query logic

    let query = knex(this.table)
      .select("employee_id", "check_in_time", "date")
      .whereBetween("date", [startOfMonth, endOfMonth]);

    if (employee_id) {
      query = query.where("employee_id", employee_id);
    }

    // Get all attendance entries for the given month and optional employee_id filter
    const attendanceRecords = await query;

    // Group attendance by employee and calculate the summary
    const summary = attendanceRecords.reduce((acc: any, record: any) => {
      const { employee_id, check_in_time, date } = record;

      if (!acc[employee_id]) {
        acc[employee_id] = {
          employee_id,
          days_present: 0,
          times_late: 0,
        };
      }

      // Increment days_present if the employee attended
      acc[employee_id].days_present++;

      // Check if the employee is late (if check_in_time > 09:45:00)
      if (check_in_time > "09:45:00") {
        acc[employee_id].times_late++;
      }

      return acc;
    }, {});

    // Convert the summary object to an array
    return Object.values(summary);
  }
}
