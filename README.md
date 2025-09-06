# HR Management Backend

Objective

The goal of this project is to build a simple and efficient HR Management System backend that facilitates employee management, attendance tracking, and monthly attendance reports. This system will include user authentication (using JWT), CRUD operations for employee data, and attendance tracking features. The system will also generate monthly reports showing days present and late arrivals (late defined as check-in after 9:45 AM).

## Features

- **HR User Authentication**: Login: HR users can log in using email and password, which returns a JWT token for further authentication on routes.
Protect sensitive routes using JWT Middleware (for example, /employees and /attendance routes).
- **Employee Management (CRUD)**: Create Employee: HR can create new employee records with details like name, age, designation, hiring date, salary, and photo (multipart form-data for photo upload).

Get All Employees: HR can list all employees with optional pagination and filters like name or designation.

Get Employee by ID: HR can fetch a single employee's data by their ID.

Update Employee: HR can update employee details, including replacing or updating the photo.

Delete Employee: HR can delete an employee record (soft delete with a deleted_at timestamp to retain the data).
- **Attendance Management (CRUD)**: Create/Upsert Attendance: HR can create or update an attendance entry for employees (employee_id, date, check_in_time). If the attendance record for that day already exists, it will update the check_in_time.

Get All Attendance: HR can view all attendance records for employees with optional filters (employee_id, date range).

Get Attendance by ID: HR can view a specific attendance record by its ID.

Update Attendance: HR can update an attendance record by its ID.

Delete Attendance: HR can delete an attendance record by its ID.
- **Monthly Attendance Reports**: Generate Monthly Report: HR can generate a monthly attendance summary showing the number of days present and times late for each employee.

Late is defined as check_in_time after 9:45 AM.
- **Search and Filter**: Search Employees by Name: HR can search employees by name using the ILIKE SQL query (partial matching).

Filter Attendance by Date Range: HR can filter attendance records by a date range (e.g., from 2025-08-01 to 2025-08-31).
- **Soft Delete**: Employees can be soft-deleted with a deleted_at field instead of being permanently removed from the database.
- **File Uploads**: Employee Photos: HR can upload employee photos when creating or updating employee records using Multer.
- **Security**: JWT Authentication: Protect routes that require authentication and authorization using JWT.

bcrypt: Hash passwords before storing them in the database and compare passwords during login.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: postgres with knex
- **Validation**: joi

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sayedhasan019283/M360ICT-backend-task.git
cd M360ICT-backend-task
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Application Environment
NODE_ENV=development
SOCKET=8082
PORT=8080
LOCAL_SERVER=sayed.sakibahmad.com

# PostgreSQL Connection (Knex)
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=Sayed15924
PG_DATABASE=m360ict_task_DB
PG_SSL=false
# BACKEND_IP=10.10.11.65
# Database URL
DATABASE_URL=postgres://postgres:Sayed15924@localhost:5432/m360ict_task_DB

# JWT Configuration
JWT_SECRET=b7d4672a3e0324f4f3e79b91d4d8f2f5ad90d2e35106c6b8a42358dbdd846b88
JWT_EXPIRATION_TIME=365d
JWT_REFRESH_EXPIRATION_TIME=365d
JWT_RESET_PASSWORD_EXPIRATION_TIME=10m
JWT_VERIFY_EMAIL_EXPIRATION_TIME=10m

# Bcrypt Configuration
BCRYPT_SALT_ROUNDS=10
```

4. Start the development server:
```bash
npm run dev
```
5. Create Table For development server:
```bash
npm run migrate
```
6. Seed data in DB table:
```bash
npm run seeder
```
