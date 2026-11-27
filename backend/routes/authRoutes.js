
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Profile image upload configuration
const profileUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    },
});

// Student registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide your name, email and password.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[a-zA-Z0-9._%+-]+@daystar\.ac\.ke$/.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Registration requires a valid @daystar.ac.ke email.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
            });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Account created successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({
            message: "Unable to create account. Please try again.",
        });
    }
});

// Student login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide your email and password.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            message: "Unable to log in. Please try again.",
        });
    }
});


// Get currently logged-in student
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Student account not found.",
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                phone: user.phone,
                location: user.location,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to retrieve student profile.",
        });
    }
});


// Update student profile
router.put("/me", authMiddleware, async (req, res) => {
    try {
        const { name, phone, location } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    message: "Name cannot be empty.",
                });
            }
            updates.name = name.trim();
        }

        if (phone !== undefined) {
            updates.phone = phone.trim();
        }

        if (location !== undefined) {
            updates.location = location.trim();
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "Student account not found.",
            });
        }

        res.json({
            message: "Profile updated successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                phone: user.phone,
                location: user.location,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Profile update error:", error.message);

        res.status(500).json({
            message: "Unable to update profile.",
        });
    }
});


 // Upload student profile picture
router.post(
    "/me/photo",
    authMiddleware,
    profileUpload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please select a profile picture.",
                });
            }

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "starmarket/profiles",
                    resource_type: "image",
                },
                async (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            message: "Profile image upload failed.",
                        });
                    }

                    try {
                        const user = await User.findByIdAndUpdate(
                            req.user.id,
                            { profileImage: result.secure_url },
                            { new: true }
                        ).select("-password");

                        if (!user) {
                            return res.status(404).json({
                                message: "Student account not found.",
                            });
                        }

                        res.json({
                            message: "Profile picture updated successfully.",
                            profileImage: user.profileImage,
                        });
                    } catch (dbError) {
                        res.status(500).json({
                            message: "Image uploaded, but profile could not be updated.",
                        });
                    }
                }
            );

            Readable.from(req.file.buffer).pipe(uploadStream);

        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);


export default router;
