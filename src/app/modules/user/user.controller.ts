import { Request, Response } from 'express';  // Express types
import { StatusCodes } from 'http-status-codes';  // HTTP status codes
import ApiError from '../../../errors/ApiError';  // Custom error class
import sendResponse from '../../../shared/sendResponse';  // Assuming a helper for sending response
import { AuthService } from './user.service';  // Import AuthService

const service = new AuthService();  // Instantiate the AuthService class

export class AuthController {
  
  // Controller to handle user registration
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;  // Get user data from the request body

      // Call the AuthService to handle user creation
      const result = await service.createUser(userData);

      // If the user's email is verified, return success
      if (result) {
        sendResponse(res , {
            code : 201,
            message: 'Hr Created Successfully!',
            data: result,
        })
      } 
    } catch (err: any) {
      // Catch any errors and send the appropriate response
      res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message || 'Something went wrong',
      });
    }
  }

  // Controller to handle user login
  public async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const loginData = req.body;  // Get login data from the request body

      // Check if login data is provided
      if (!loginData) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Login data must be provided");
      }

      // Call the AuthService to handle login
      const result = await service.loginUser(loginData);

      // Send response with the user data and generated tokens
      sendResponse(res, {
        code: StatusCodes.OK,
        message: 'Login successful',
        data: result,
      });
    } catch (err: any) {
      // Catch any errors and send the appropriate response
      res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message || 'Something went wrong',
      });
    }
  }
}
