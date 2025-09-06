import { knex as Knex } from 'knex'; // Knex constructor
import { Employee } from './employe.interface';
import knexConfig from '../../../database/knexfile';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

// Select the correct environment (development, staging, production)
const knex = Knex(knexConfig.development); 

export class EmployeeService {
  private table = 'employees';

  async create(employee: Employee): Promise<Employee> {
    const [newEmployee] = await knex(this.table)
      .insert(employee)
      .returning('*');
    return newEmployee;
  }

  async findAll({
    filters = {},
    limit = 10,
    page = 1,
  }: {
    filters?: any;
    limit: number;
    page: number;
  }): Promise<Employee[]> {
    try {
      let query = knex(this.table).select("*"); // Start with the base query

      // Apply filters if provided
      if (filters.name) {
        query = query.where("name", "like", `%${filters.name}%`);
      }
      if (filters.designation) {
        query = query.where("designation", "like", `%${filters.designation}%`);
      }

      // Apply pagination (limit and offset)
      query = query.limit(limit).offset((page - 1) * limit);

      // Execute the query and return the results
      const results = await query;
      return results;
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Error fetching employees: ${error}`);
    }
  }



  async findById(id: number): Promise<Employee | null> {
    const employee = await knex(this.table).where({ id }).first();
    return employee || null;
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee | null> {
    const [updatedEmployee] = await knex(this.table)
      .where({ id })
      .update({ ...data, updated_at: knex.fn.now() })
      .returning('*');
    return updatedEmployee || null;
  }

  async delete(id: number): Promise<void> {
    const result =  await knex(this.table).where({ id }).del();
    console.log( "delete result from service", result)
  }
}
