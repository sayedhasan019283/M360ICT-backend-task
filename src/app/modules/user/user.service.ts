import { knex as Knex } from 'knex';  // Knex constructor
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';  // HTTP status codes
import ApiError from '../../../errors/ApiError';  // Custom error class
import config from '../../../config';  // Configuration file
import { ILogin } from '../../../types/auth';  // ILogin interface
import { jwtHelper } from '../../../helpers/jwtHelper';  // JWT helper
import knexConfig from '../../../database/knexfile';  // Knex configuration

// Initialize knex with the correct environment (development, staging, production)
const knex = Knex(knexConfig.development); // Ensure knexConfig is correctly set for your environment


export class AuthService {
  private table = 'hr_users';  // Table name for HR users
    static createUser: any;
    static loginUser: any;

  // Hash password before saving
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  // Compare entered password with stored hash
  private async comparePassword(enteredPassword: string, storedHash: string): Promise<boolean> {
    const match = await bcrypt.compare(enteredPassword, storedHash);
    return match;
  }

  // Create a new user
  public async createUser(userData: any): Promise<any> {
    try {
      // Check if the user already exists
      const existingUser = await knex(this.table).where({ email: userData.email }).first();
        if (existingUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User Exist with this email")   
        }
      // Hash the password before saving
      const hashedPassword = await this.hashPassword(userData.password_hash);
      userData.password_hash = hashedPassword;

      // Insert the new user into the database
      const [newUser] = await knex(this.table)
        .insert(userData)
        .returning('*');  // Return the created user data


      return newUser;
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error creating user: ${error}`);
    }
  }

  // Login user
   public async loginUser(payload: ILogin): Promise<any> {
    try {
        console.log("===========>>" ,payload)
      // Fetch user by email
      const user = await knex(this.table)
        .where({ email: payload.email })
        .first();  // We only need the first user matching the email

      if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found.');
      }

      console.log("user =========>>>>>>>>>>", user)
      // Hash the entered password before comparing it to the stored hash
      const isPasswordValid = await this.comparePassword(payload.password_hash, user.password_hash);
      console.log("isPasswordValid=========>>>>", isPasswordValid)
      if (!isPasswordValid) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'The password you entered is incorrect. Please check and try again.'
        );
      }

      // Remove password from the user object
      const { password_hash, ...userWithoutPassword } = user;

      // Create JWT tokens (access token and refresh token)
      const accessTokenPayload = {
        id: user.id,
        role: "hr",  // Assuming `role` is part of the user model
      };

      // Generate access token
      const accessToken = jwtHelper.createToken(
        accessTokenPayload,
        config.db.jwt_secret as string,  // Ensure jwt_secret is provided in config
        config.db.jwt_expiration_time as string  // You can adjust the expiration time from config
      );

      // Generate refresh token
      const refreshToken = jwtHelper.createToken(
        accessTokenPayload,
        config.db.jwt_secret as string,
        config.db.jwt_expiration_time as string // Typically longer expiration time for refresh token
      );

      // Return user data and tokens
      return {
        user: userWithoutPassword,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Error logging in: ${error}`);
    }
  }
}
