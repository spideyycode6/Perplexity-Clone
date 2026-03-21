import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";




export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            error: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            error: error.message
        });
    }
};