// hr_users.validation.ts
import Joi from 'joi';

// Joi schema for creating and updating an hr_user
const createHrUserSchema = Joi.object({
  email: Joi.string().email().required(), // Ensure email is a valid email and is required
  password_hash: Joi.string().required(), // Ensure password_hash is required
  name: Joi.string().min(3).required(), // Ensure name is at least 3 characters long and is required
  created_at: Joi.date().default(Date.now), // Default to current timestamp
  updated_at: Joi.date().default(Date.now), // Default to current timestamp
});

const updateHrUserSchema = Joi.object({
  email: Joi.string().email().optional(), // email is optional for update
  password_hash: Joi.string().optional(), // password_hash is optional for update
  name: Joi.string().min(3).optional(), // name is optional for update
  updated_at: Joi.date().default(Date.now), // Default to current timestamp
});

export const userValidation = {
    createHrUserSchema,
    updateHrUserSchema
} 
