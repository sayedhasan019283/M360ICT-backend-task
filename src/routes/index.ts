import express from 'express';
import path from 'path';
import { userRoute } from '../app/modules/user/user.route';
import { employeeRoute } from '../app/modules/employe/employe.route';
import { attendanceRoute } from '../app/modules/attendance/attendance.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/employee',
    route: employeeRoute,
  },
  {
    path: '/attendance',
    route: attendanceRoute,
  },
];   

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
