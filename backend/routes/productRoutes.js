
import express from "express";
import multer from "multer";
import { Readable } from "node:stream";
import Product from "../models/Product.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Image upload configuration
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    },
});

// Upload product image to Cloudinary
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please select an image." });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "starmarket/products", resource_type: "image" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: error.message });
                }

                res.status(200).json({
                    imageUrl: result.secure_url,
                });
            }
        );

        Readable.from(req.file.buffer).pipe(uploadStream);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get products belonging to the logged-in student
router.get("/mine", authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({
            sellerId: req.user.id,
        }).sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get one product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update a student's own product
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId: req.user.id,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized to edit it.",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "price",
            "category",
            "condition",
            "location",
            "images",
            "status",
            "negotiable",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        await product.save();

        res.json({
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a student's own product
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            _id: req.params.id,
            sellerId: req.user.id,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized to delete it.",
            });
        }

        res.json({
            message: "Product deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Create a product
router.post("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "Student account not found.",
            });
        }

        const product = await Product.create({
            ...req.body,
            seller: user.name,
            sellerId: user._id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
