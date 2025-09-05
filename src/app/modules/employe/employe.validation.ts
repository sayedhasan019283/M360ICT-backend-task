import Joi from 'joi';

const createEmployeeSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().required(),
  designation: Joi.string().required(),
  hiring_date: Joi.date().required(),
  date_of_birth: Joi.date().required(),
  salary: Joi.number().precision(2).required(),
  photo_path: Joi.string().optional(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().optional(),
  age: Joi.number().integer().optional(),
  designation: Joi.string().optional(),
  hiring_date: Joi.date().optional(),
  date_of_birth: Joi.date().optional(),
  salary: Joi.number().precision(2).optional(),
  photo_path: Joi.string().optional(),
});

export const employeeValidation = {
    createEmployeeSchema, 
    updateEmployeeSchema
}
