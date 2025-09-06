import httpStatus from 'http-status'; 
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { USER_ROLE } from "../modules/user/user.constant"; // Role definitions
import { knex as Knex } from 'knex'; // Knex constructor
import knexConfig from "../../database/knexfile";
import config from "../../config";
import AppError from "../../errors/AppError";

// Select the correct environment (development, staging, production)
const knex = Knex(knexConfig.development);

// Define the types for JWT payload
interface JwtCustomPayload extends JwtPayload {
  userId: number;
  role: keyof typeof USER_ROLE;
}



const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawToken = req.headers.authorization;
      const token = rawToken?.split(' ')[1]; // Extract token

      // Check if the token exists
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      // Decode JWT token
      const decoded = jwt.verify(token, config.db.jwt_secret as string) as JwtCustomPayload;

      // Log decoded payload for debugging
      console.log("Decoded token:", decoded);

      const { id, role } = decoded;

      if (!id) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User ID is missing in token');
      }

      // Check if user exists
      const user = await knex("hr_users").where({ id: id }).first();

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
      }

      // Check role permissions
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return res.status(403).send({
          success: false,
          statusCode: 403,
          message: 'You have no access to this route',
        });
      }

      req.user = decoded; // Attach user data to request
      next();
    } catch (error) {
      next(error); // Pass error to the next error handler
    }
  };
};

export default auth;

