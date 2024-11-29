import { Router } from "express";
import { courseModel, purchaseModel, userModel } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { userMiddleware } from "../middleware/user.js";
const JWT_SECRET = process.env.JWT_USER_PASSWORD;
const userRoute = Router();

userRoute.post('/signup', async function(req, res){
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.create({
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


userRoute.post('/signin', async function(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email: email });
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

userRoute.get('/purchase', userMiddleware,async function(req, res){
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId,
        courseId
    })
    let purchasedCourseIds = [];
    for(let i = 0; i < purchases.length; i++){
        purchasedCourseIds.push(purchases[i].courseId)
    }
    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds}
    })
    res.json({
        message: "User purchases",
        purchases
    });
});

export { userRoute };
