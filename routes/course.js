import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import { courseModel, purchaseModel } from "../db.js";
const courseRouter = Router();

courseRouter.post('/purchase',userMiddleware ,async function(req, res) {
    const userId = req.userId;
    const courseId = req.userId;

    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "Course Purchased"
    });
});

courseRouter.get('/preview', async function(req, res) {
    const courses = await courseModel.find({});
    res.json({
        message: "Courses Preview",
        courses
    });
});

export { courseRouter };
