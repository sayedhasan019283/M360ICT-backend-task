import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service"; // Import service
import { Attendance } from "./attendance.interface"; // Import the interface
import { StatusCodes } from "http-status-codes"; // For HTTP status codes
import sendResponse from "../../../shared/sendResponse"; // Assuming sendResponse utility
import knex from "knex";
import { attendanceValidation } from "./attendance.validation";

const service = new AttendanceService();

export class AttendanceController {
  // Get all attendance entries with filters (employee_id, date, range, or month)
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query; // Extract query parameters

      // Parse range as an object with start and end dates if provided
      const range = filters.range ? JSON.parse(filters.range as string) : undefined;
      const month = filters.month as string | undefined;

      // If month is provided, fetch monthly data
      if (month) {
        // Fetch the monthly attendance summary
        const attendanceSummary = await service.getMonthlyAttendanceReport(month, filters.employee_id ? parseInt(filters.employee_id as string) : undefined);

        sendResponse(res, {
          code: StatusCodes.OK,
          message: "Monthly attendance report fetched successfully.",
          data: attendanceSummary,
        });
      } else {
        // Otherwise, fetch the filtered attendance list
        const attendanceList = await service.getAll({
          employee_id: filters.employee_id ? parseInt(filters.employee_id as string) : undefined,
          date: filters.date ? (filters.date as string) : undefined,
          range,
        });

        sendResponse(res, {
          code: StatusCodes.OK,
          message: "Attendance fetched successfully.",
          data: attendanceList,
        });
      }
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error fetching attendance.",
        data: error,
      });
    }
  }

  // Get attendance entry by ID
  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const attendance = await service.getById(parseInt(req.params.id));

      if (!attendance) {
        sendResponse(res, {
          code: StatusCodes.NOT_FOUND,
          message: "Attendance not found.",
        });
        return;
      }

      sendResponse(res, {
        code: StatusCodes.OK,
        message: "Attendance fetched successfully.",
        data: attendance,
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error fetching attendance by ID.",
        data: error,
      });
    }
  }

 // Create or upsert attendance
  public async upsert(req: Request, res: Response): Promise<void> {
    try {
      // Validate the incoming request data using Joi schema
      const { error } = attendanceValidation.createAttendanceSchema.validate(req.body);
      
      if (error) {
        return sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: "Invalid data provided.",
          data: error.details,
        });
      }

      const data = req.body; // Get the attendance data from the body
      const result = await service.upsert(data);

      sendResponse(res, {
        code: StatusCodes.CREATED,
        message: "Attendance created or updated successfully.",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error creating or updating attendance.",
        data: error,
      });
    }
  }

  // Update attendance by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      // Validate the incoming request data using Joi schema
      const { error } = attendanceValidation.updateAttendanceSchema.validate(req.body);
      
      if (error) {
        return sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: "Invalid data provided.",
          data: error.details,
        });
      }

      const data: Partial<Attendance> = req.body;
      const result = await service.update(parseInt(req.params.id), data);

      if (!result) {
        sendResponse(res, {
          code: StatusCodes.NOT_FOUND,
          message: "Attendance not found.",
        });
        return;
      }

      sendResponse(res, {
        code: StatusCodes.OK,
        message: "Attendance updated successfully.",
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error updating attendance.",
        data: error,
      });
    }
  }

  // Delete attendance by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      await service.delete(parseInt(req.params.id));

      sendResponse(res, {
        code: StatusCodes.NO_CONTENT,
        message: "Attendance deleted successfully.",
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error deleting attendance.",
        data: error,
      });
    }
  }

  // Monthly attendance summary report
  public async getMonthlyReport(req: Request, res: Response): Promise<void> {
    try {
      const { month, employee_id } = req.query;

      if (!month) {
        sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: "Month parameter is required.",
        });
        return;
      }

      // Fetch the monthly attendance report
      const report = await service.getMonthlyAttendanceReport(month as string, employee_id ? parseInt(employee_id as string) : undefined);

      sendResponse(res, {
        code: StatusCodes.OK,
        message: "Monthly attendance report fetched successfully.",
        data: report,
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error fetching monthly attendance report.",
        data: error,
      });
    }
  }
}
