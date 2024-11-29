import { Router } from "express";
import {adminModel, courseModel} from '../db.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { adminMiddleware } from "../middleware/admin.js";
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_ADMIN_PASSWORD;
const adminRoute = Router();

adminRoute.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await adminModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        res.json({
            message: "Signup successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error during signup"
        });
    }
});

adminRoute.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const payload = {
            userId: user._id,
            email: user.email
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error during login"
        });
    }
});

adminRoute.post('/course', adminMiddleware,async function(req, res){
    const adminId = req.userId;

    const {title, description, imageUrl, price } = req.body;
    await courseModel.create({
        _id: courseId,
        createrId: adminId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })
    res.json({
        message: "Created Course"
    });
});

adminRoute.put('/course', adminMiddleware, async function(req, res){
    const adminId = req.userId;
    const {title, description, imageUrl, price, courseId} = req.body;

    await courseModel.updateOne({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        createrId: adminId
    })
    res.json({
        message: "Course Edit"
    });
});

adminRoute.get('/course/bulk',adminMiddleware,async function (req, res) {
    const adminId = req.userId;

    await courseModel.find({
        createrId: adminId
    })
    res.json({
        message: "Get all Courses",
        createrId: adminId
    });
});

export { adminRoute };