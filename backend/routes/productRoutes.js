
import express from "express";
import multer from "multer";
import { Readable } from "node:stream";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

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

// Create a product
router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
