// src/app/controllers/employee.controller.ts
import { Request, Response } from 'express';
import { Employee } from './employe.interface';
import { EmployeeService } from './employe.service';
import { employeeValidation } from './employe.validation';
import sendResponse from '../../../shared/sendResponse';



const service = new EmployeeService();

export class EmployeeController {
  // Create employee
  static async create(req: Request, res: Response) {
  try {
    const data: Employee = req.body;

    // Check if a file was uploaded
    if (req.file) {
      // Assign the file path to data.photo_path
      data.photo_path = `/uploads/photo_path/${req.file.filename}`;
      console.log(`File uploaded to: /uploads/photo_path/${req.file.filename}`);
    }

    console.log("========>>>>>>>>>", data);
    console.log("type====>>", typeof(data.name));

    // Validate the employee data using Joi
    const { error } = employeeValidation.createEmployeeSchema.validate(data);

    // If validation fails, return a 400 response with error details
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message), // Send detailed validation error messages
      });
    }

    // Create the employee using the service
    const employee = await service.create(data);

    // Return the created employee in the response
    sendResponse(res, {
        code : 201,
        message : "Employee Created Successfully",
        data : employee
      })
  } catch (err: any) {
    console.error(err);  
    sendResponse(res, {
        code : 201,
        message : "Employee Not Created Successfully",
        data : err
      })
  }
}


  // Get all employees
static async getAll(req: Request, res: Response) {
    try {
      const { limit, page, name, designation } = req.query;

      // Set default values for pagination if not provided
      const pageNum = page ? parseInt(page as string) : 1;
      const pageSize = limit ? parseInt(limit as string) : 10;

      const filters: any = {};

      if (name) filters.name = name as string;
      if (designation) filters.designation = designation as string;

      // Call the service to get all employees with filters and pagination
      const employees = await service.findAll({
        filters,
        limit: pageSize,
        page: pageNum,
      });

      // Send the result as a response
      sendResponse(res, {
        code: 200,
        message: "Get All Employees Successfully",
        data: employees,
      });
    } catch (error) {
      // Log the error for debugging
      console.error(error);

      sendResponse(res, {
        code: 400,
        message: "Didn't find any employee",
        data: error,
      });
    }
  }

  // Get employee by ID
  static async getById(req: Request, res: Response) {
    const employee = await service.findById(Number(req.params.id));
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    sendResponse(res, {
        code : 200,
        message : "Employee Find By Id Successfully.",
        data : employee
      })
  }

  // Update employee by ID
  static async update(req: Request, res: Response) {
    try {
      const data =  req.body;
      // Check if a file was uploaded
    if (req.file) {
      // Assign the file path to data.photo_path
      data.photo_path = `/uploads/photo_path/${req.file.filename}`;
      console.log(`File uploaded to: /uploads/photo_path/${req.file.filename}`);
    }
    // Validate the employee data using Joi
    const { error } = employeeValidation.updateEmployeeSchema.validate(data);

    // If validation fails, return a 400 response with error details
    if (error) {
      return res.status(400).json({
        error: error.details.map((detail) => detail.message), // Send detailed validation error messages
      });
    }

      const employee = await service.update(Number(req.params.id), data);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      sendResponse(res, {
        code : 200,
        message : "Employee Update Successfully",
        data : employee
      })
    } catch (err: any) {
      sendResponse(res, {
        code : 400,
        message : "Employee Not Updated Successfully",
        data : err
      })
    }
  }

  // Delete employee by ID
  static async delete(req: Request, res: Response) {
    await service.delete(Number(req.params.id));
    sendResponse(res, {
        code : 204,
        message : "Employee Created Successfully"
      })
  }
}
