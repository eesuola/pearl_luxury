import express from "express";
import * as courseController from "../controller/course.controller.js";
import * as resultController from "../controller/result.controller.js";
import * as studentController from "../controller/student.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routes = express.Router();

// Course routes
routes.post("/courses", authMiddleware, courseController.createCourse);
routes.put("/courses/:id", authMiddleware, courseController.updateCourse);
routes.delete("/courses/:id", authMiddleware, courseController.deleteCourse);
routes.get("/get-all-courses", authMiddleware, courseController.getAllCourses);

// Result routes
routes.post("/results", authMiddleware, resultController.createResult);
routes.put("/results/:id", authMiddleware, resultController.updateResult);
routes.delete("/results/:id", authMiddleware, resultController.deleteResult);
routes.get("/get-all-results", authMiddleware, resultController.getAllResults);

// Student routes
routes.post("/students", authMiddleware, studentController.createStudent);
routes.put("/students/:id", authMiddleware, studentController.updateStudent);
routes.delete("/students/:id", authMiddleware, studentController.deleteStudent);
routes.get("/get-all-students", authMiddleware, studentController.getAllStudents);

export default routes;