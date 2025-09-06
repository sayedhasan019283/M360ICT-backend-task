import express from "express";
import { AttendanceController } from "./attendance.controller"; // Import AttendanceController
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { attendanceValidation } from "./attendance.validation";

const router = express.Router();
const controller = new AttendanceController(); // Create an instance of the controller

// Define routes for the attendance API
router.get(
    "/",
    auth(USER_ROLE.hr),
     controller.getAll
    ); // List all attendance records with optional filters
router.get(
    "/:id",
    auth(USER_ROLE.hr),
     controller.getById
    ); // Get a single attendance entry by ID
router.post(
    "/",
    auth(USER_ROLE.hr),
    // validateRequest(attendanceValidation.createAttendanceSchema),
     controller.upsert
    ); // Create or upsert attendance
router.put(
    "/:id",
    auth(USER_ROLE.hr),
    // validateRequest(attendanceValidation.updateAttendanceSchema),
     controller.update
    ); // Update attendance by ID
router.delete(
    "/:id",
    auth(USER_ROLE.hr),
     controller.delete
    ); // Delete attendance by ID

// Route for monthly attendance summary report
router.get(
    "/reports/attendance",
    auth(USER_ROLE.hr),
     controller.getMonthlyReport
    ); // Monthly attendance report

export const attendanceRoute = router; // Export the router for use in the main app
