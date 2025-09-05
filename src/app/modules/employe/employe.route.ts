// src/app/routes/employee.route.ts
import { Router } from 'express';
import { EmployeeController } from './employe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { employeeValidation } from './employe.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

const UPLOADS_FOLDER = 'uploads/photo_path';
const upload = fileUploadHandler(UPLOADS_FOLDER);

// POST /employees -> create a new employee
router.post(
    '/',
    upload.single('photo_path'),
    // validateRequest(employeeValidation.createEmployeeSchema),
     EmployeeController.create
    );

// GET /employees -> get all employees
router.get(
    '/',
     EmployeeController.getAll
    );

// GET /employees/:id -> get a single employee by ID
router.get(
    '/:id',
     EmployeeController.getById
    );

// PUT /employees/:id -> update employee by ID
router.put(
    '/:id',
    upload.single('photo_path'),
    // validateRequest(employeeValidation.updateEmployeeSchema),
    EmployeeController.update
);

// DELETE /employees/:id -> delete employee by ID
router.delete(
    '/:id',
     EmployeeController.delete
    );

export const employeeRoute = router;
