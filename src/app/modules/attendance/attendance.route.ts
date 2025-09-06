import express from "express";
import { AttendanceController } from "./attendance.controller"; // Import AttendanceController

const router = express.Router();
const controller = new AttendanceController(); // Create an instance of the controller

// Define routes for the attendance API
router.get("/", controller.getAll); // List all attendance records with optional filters
router.get("/:id", controller.getById); // Get a single attendance entry by ID
router.post("/", controller.upsert); // Create or upsert attendance
router.put("/:id", controller.update); // Update attendance by ID
router.delete("/:id", controller.delete); // Delete attendance by ID

// Route for monthly attendance summary report
router.get("/reports/attendance", controller.getMonthlyReport); // Monthly attendance report

export const attendanceRoute = router; // Export the router for use in the main app
