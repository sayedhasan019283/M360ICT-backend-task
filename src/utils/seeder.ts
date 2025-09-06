import knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from '../database/knexfile';

// Initialize knex with the correct configuration
const db = knex(knexConfig.development);  // Ensure correct environment

const saltRounds = 10;

console.log('Starting seed execution...');

export default async function seed(): Promise<void> {
  try {
    console.log('Clearing existing data...');

    // Clear existing data from tables
    await db('attendance').del();
    console.log('Attendance data cleared');
    await db('hr_users').del();
    console.log('HR Users data cleared');
    await db('employees').del();
    console.log('Employees data cleared');

    // Seed data for employees (10 entries)
    console.log('Seeding employees...');
    const employees = [
      { name: 'John Doe', age: 30, designation: 'Developer', hiring_date: '2020-01-01', date_of_birth: '1991-06-15', salary: 60000.00, photo_path: 'path_to_photo_1' },
      { name: 'Jane Smith', age: 25, designation: 'Designer', hiring_date: '2021-03-15', date_of_birth: '1996-02-20', salary: 55000.00, photo_path: 'path_to_photo_2' },
      { name: 'Alex Johnson', age: 28, designation: 'Product Manager', hiring_date: '2019-07-10', date_of_birth: '1993-03-25', salary: 75000.00, photo_path: 'path_to_photo_3' },
      { name: 'Emily Davis', age: 35, designation: 'HR Specialist', hiring_date: '2018-11-12', date_of_birth: '1986-04-05', salary: 65000.00, photo_path: 'path_to_photo_4' },
      { name: 'Michael Brown', age: 40, designation: 'CTO', hiring_date: '2015-08-30', date_of_birth: '1981-09-10', salary: 120000.00, photo_path: 'path_to_photo_5' },
      { name: 'Sarah Wilson', age: 32, designation: 'Marketing Lead', hiring_date: '2020-06-15', date_of_birth: '1989-12-22', salary: 70000.00, photo_path: 'path_to_photo_6' },
      { name: 'David Lee', age: 27, designation: 'Software Engineer', hiring_date: '2021-02-18', date_of_birth: '1994-09-30', salary: 65000.00, photo_path: 'path_to_photo_7' },
      { name: 'Jessica Martinez', age: 29, designation: 'Designer', hiring_date: '2019-12-01', date_of_birth: '1992-11-15', salary: 55000.00, photo_path: 'path_to_photo_8' },
      { name: 'Daniel Garcia', age: 26, designation: 'QA Engineer', hiring_date: '2021-09-10', date_of_birth: '1995-02-10', salary: 60000.00, photo_path: 'path_to_photo_9' },
      { name: 'Sophia Taylor', age: 33, designation: 'Business Analyst', hiring_date: '2017-05-20', date_of_birth: '1988-06-08', salary: 70000.00, photo_path: 'path_to_photo_10' }
    ];

    const insertedEmployees = await db('employees').insert(employees).returning('id');
    console.log('Employees seeded:', insertedEmployees);

    // Seed data for hr_users (with bcrypt hashed passwords, 10 users)
    console.log('Seeding hr_users...');
    const users = [
      { email: 'john.doe@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'John Doe' },
      { email: 'jane.smith@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Jane Smith' },
      { email: 'alex.johnson@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Alex Johnson' },
      { email: 'emily.davis@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Emily Davis' },
      { email: 'michael.brown@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Michael Brown' },
      { email: 'sarah.wilson@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Sarah Wilson' },
      { email: 'david.lee@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'David Lee' },
      { email: 'jessica.martinez@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Jessica Martinez' },
      { email: 'daniel.garcia@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Daniel Garcia' },
      { email: 'sophia.taylor@example.com', password_hash: await bcrypt.hash('password123', saltRounds), name: 'Sophia Taylor' }
    ];

    const insertedUsers = await db('hr_users').insert(users).returning('id');
    console.log('HR Users seeded:', insertedUsers);

    // Seed data for attendance (10 records)
    console.log('Seeding attendance...');
    const attendanceRecords = insertedEmployees.map((employee: { id: number }) => {
      const date = new Date(); // Current date
      const checkInTime = new Date(date.setHours(9, 0, 0)); // Set check-in time at 09:00 AM

      return {
        employee_id: employee.id,
        date: new Date(),
        check_in_time: checkInTime,
      };
    });

    await db('attendance').insert(attendanceRecords);
    console.log('Attendance seeded successfully!');
  } catch (error) {
    console.error('Error while seeding:', error);
  } finally {
    db.destroy(); // Close the database connection
    console.log('Database connection closed.');
  }
}

seed().catch(err => {
  console.error('Error during seeding:', err);
});
