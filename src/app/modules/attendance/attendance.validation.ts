import Joi from 'joi';

export const createAttendanceSchema = Joi.object({
  employee_id: Joi.number().integer().required().positive(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.date().iso().required(),
});

export const updateAttendanceSchema = Joi.object({
  employee_id: Joi.number().integer().required().positive(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.date().iso().required(),
});
