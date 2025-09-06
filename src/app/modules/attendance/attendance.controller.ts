import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service"; // Import service
import sendResponse from "../../../shared/sendResponse"; // Assuming you have a helper for sending responses
import { StatusCodes } from "http-status-codes"; // For HTTP status codes

const service = new AttendanceService();

export class AttendanceController {
  // Get all attendance entries with filters (employee_id, date, range)
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = {}; // Filters object to pass to the service

      // Extract query parameters
      const { employee_id, date, range } = req.query;

      // Add filters if they exist in the query
      if (employee_id) filters.employee_id = parseInt(employee_id as string);
      if (date) filters.date = date as string;
      if (range) {
        try {
          filters.range = JSON.parse(range as string);
        } catch (error) {
          return sendResponse(res, {
            code: StatusCodes.BAD_REQUEST,
            message: "Invalid range format. Please provide valid JSON format.",
          });
        }
      }

      // Get attendance data from the service with filters
      const attendanceList = await service.getAll(filters);

      // Send the filtered data as a response
      sendResponse(res, {
        code: StatusCodes.OK,
        message: "Attendance fetched successfully.",
        data: attendanceList,
      });
    } catch (error) {
      sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error fetching attendance.",
        data: error,
      });
    }
  }

  // Get a single attendance entry by ID
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
      const data = req.body;
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
        return sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: "Month is required. Please provide a valid month in YYYY-MM format.",
        });
      }

      // Fetch the monthly attendance report from the service
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
