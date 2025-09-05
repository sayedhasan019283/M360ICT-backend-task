import express from 'express';
import path from 'path';
import { userRoute } from '../app/modules/user/user.route';
import { employeeRoute } from '../app/modules/employe/employe.route';
const router = express.Router();

const apiRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/employee',
    route: employeeRoute,
  }
];   

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
