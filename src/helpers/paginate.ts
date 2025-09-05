import knex from 'knex'; // Import your knex instance
import { PaginateOptions, PaginateResult } from '../types/paginate';

// Pagination function for Knex
const paginate = (table: string) => {
  return async (options: PaginateOptions): Promise<PaginateResult<any>> => {
    const limit = options.limit ?? 10;
    const page = options.page ?? 1;
    const skip = (page - 1) * limit;
    const sort = options.sortBy ?? 'createdAt';

    // Count the total number of records based on the filter
    const countResult = await knex(table)
      .count('* as count')
      .first();  // Get the first result since it's a count query
    
    // Ensure that countResult is not undefined and cast count to a number
    const totalResults = countResult?.count ? Number(countResult.count) : 0;

    // Execute the paginated query
    const results = await knex(table)
      .limit(limit)
      .offset(skip)
      .orderBy(sort);  // Sorting by the specified field

    // Return paginated results
    return {
      results,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      totalResults,  // Total results as a number
    };
  };
};

export default paginate;
