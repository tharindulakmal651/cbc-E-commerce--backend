import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Create new user
export function createUser(req, res) {
    const newUserData = req.body;

    // Only admins can create admin accounts
    if (newUserData.type =="admin") {
        if (req.user == null) {
             res.json({ 
                message: "Please login as administrator to create admin account!"
             });
             return;
        }
        if (req.user.type !== "admin") {
             res.json({ 
                message: "Only administrators can create admin accounts!"
             });
             return;
        }
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);
    user.save()
        .then(() => res.json({ message: "User created successfully!" }))
        .catch(err => res.status(500).json({ message: "Error creating user", error: err.message }));
}

// User login
export function loginUser(req, res) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.status(404).json({ message: "User not found!" });

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordCorrect) return res.status(401).json({ message: "Incorrect password!" });

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email, type: user.type },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login successful!",
                token,
                user: {
                    email: user.email,
                    type: user.type
                }
            });
        })
        .catch(err => res.status(500).json({ message: "Error during login", error: err.message }));
}

// Delete user
export function deleteUser(req, res) {
    User.deleteOne({ email: req.params.email })
        .then(() => res.json({ message: "User deleted successfully!" }))
        .catch(err => res.status(500).json({ message: "Error deleting user", error: err.message }));
}