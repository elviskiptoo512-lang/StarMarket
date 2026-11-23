
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@daystar\.ac\.ke$/, "Use a valid Daystar University email address."],
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
        },

        profileImage: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
