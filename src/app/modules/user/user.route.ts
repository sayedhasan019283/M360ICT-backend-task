import express from "express"; // Import your class-based controller
import { AuthController } from "./user.controller";

const router = express.Router();
const authController = new AuthController();  // Create an instance of the controller

// Route for user registration (create user)
router.post("/", authController.createUser);

// You can add more routes here for other functionalities like login
router.post("/login", authController.loginUser);

export const userRoute = router;  // Export the router to use in app.js or main route file
