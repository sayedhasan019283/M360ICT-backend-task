import Joi from 'joi';

 const createAttendanceSchema = Joi.object({

  employee_id: Joi.number().integer().required().positive(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.date().iso().required(),
});

 const updateAttendanceSchema = Joi.object({
  employee_id: Joi.number().integer().required().positive(),
  date: Joi.date().iso().required(),
  check_in_time: Joi.date().iso().required(),
});

export const attendanceValidation = {
  createAttendanceSchema,
  updateAttendanceSchema
}
