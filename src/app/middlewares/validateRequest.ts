import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';  // Import Joi for validation

// Middleware function to validate requests using Joi
const validateRequest =
  (schema: Joi.ObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body, params, query, and cookies using Joi schema
      await schema.validateAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      });

      // If validation passes, move to the next middleware or route handler
      next();
    } catch (error) {
      // If validation fails, pass the error to the next error handler
      next(error);
    }
  };

export default validateRequest;
