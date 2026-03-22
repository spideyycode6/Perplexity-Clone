import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/mail.service.js";
import bcrypt from "bcryptjs";

export const registerController = async (req, res) => {
    const { username, password, email, confirmPassword } = req.body;
    const isUserExist = await userModel.findOne({
        $or: [{ email }, { username }]
    });
    if (isUserExist) {
        return res.status(400).json({
            message: "User already exists",
            success: false,
            error: "User already exists"
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match",
            success: false,
            error: "Passwords do not match"
        });
    }
    const user = await userModel.create({
        username,
        password,
        email
    });

    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

    const baseUrl =
        process.env.PUBLIC_API_URL ||
        `http://localhost:${process.env.PORT || 3000}`;
    const verifyUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/verify-email/${verificationToken}`;

    let emailSent = false;
    try {
        await sendMail({
            to: email,
            subject: "Verify your email",
            html: `Hi ${username},<br>Please verify your email by clicking on the link below:<br>
               <a href="${verifyUrl}">Verify Email</a>`,
        });
        emailSent = true;
    } catch (err) {
        console.error("Verification email failed:", err.message);
        if (process.env.NODE_ENV !== "production") {
            console.info("[dev] Verification link:", verifyUrl);
        }
    }

    return res.status(201).json({
        message: emailSent
            ? "User created successfully"
            : "User created successfully, but the verification email could not be sent. Check server logs or mail configuration.",
        success: true,
        emailSent,
        user,
    });


}

export const verifyEmailController = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: "User not found"
            });
        }
        user.verified = true;
        await user.save();

        const html = `<h1>Email Verified Successfully</h1>
        <p>You can now login to your account</p>
        <a href="http://localhost:3000/api/auth/login">Login</a>`
        res.send(html);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}
    

export const loginController = async (req, res) => {
    const { identifier} = req.body;
    const user = await userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');

    if (!user) {
        return res.status(404).json({
            message: `Invalid credentials`,
            success: false,
            error: "Invalid credentials"
        });
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "User not verified",
            success: false,
            error: "User not verified"
        });
    }

    const isPasswordMatched = await user.comparePassword(req.body.password);
    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "Invalid credentials",
            success: false,
            error: "Invalid credentials"
        });
    }

    const token = jwt.sign({id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 60 * 1000,
    });

    const userToSend = user.toObject();
    delete userToSend.password;

    return res.status(200).json({
        message: "Login successful",
        success: true,
        token,
        user: userToSend
    });

}


export const getUserProfile = async (req, res) => {
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            error: "User not found"
        });
    }
    return res.status(200).json({
        message: "User profile retrieved successfully",
        success: true,
        user
    });
}