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

  async findAll(): Promise<Employee[]> {
    try {
      // Fetch all employees from the 'employees' table
      const results = await knex(this.table).select('*');  // Select all columns

      return results;  // Return the fetched records
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST ,`Error fetching all records from the 'employees' table: ${error}`);
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
