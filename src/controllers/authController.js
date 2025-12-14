import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import nodemailer from 'nodemailer';

// Configure Nodemailer 
// NOTE: Replace these with real credentials or environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        // For security, do not reveal if user does not exist
        if (!user) {
            return res.status(200).json({ message: "If that email exists, a code has been sent." });
        }

        // Generate 4-digit code
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetCode,
                resetPasswordExpires: expiresAt
            }
        });

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}. It expires in 10 minutes.`
        };

        // Attempt to send email
        try {
            // Uncomment to actually send if credentials are set
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await transporter.sendMail(mailOptions);
            } else {
                console.log("Mock Email Sent:", mailOptions);
            }
        } catch (emailError) {
            console.error("Email send failed:", emailError);
            return res.status(500).json({ error: "Failed to send email" });
        }

        return res.status(200).json({ message: "If that email exists, a code has been sent." });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: "Email, code, and new password are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: "Invalid request" });
        }

        // Check if code matches and not expired
        if (user.resetPasswordToken !== code) {
            return res.status(400).json({ error: "Invalid code" });
        }

        // Check expiration
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            return res.status(400).json({ error: "Code expired" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const userExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const token = generateToken(user.id, res);
        return res.status(201).json({
            status: 'Success',
            data: {
                user: {
                    id: user.id,
                    name: name,
                    email: email
                }
            },
            token,
        });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate token
        const token = generateToken(user.id, res);

        return res.status(200).json({
            status: 'Success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        })
        res.status(200).json({
            status: 'Success',
            data: {
                message: 'User logged out successfully'
            }
        });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export { register, login, logout, forgotPassword, resetPassword }