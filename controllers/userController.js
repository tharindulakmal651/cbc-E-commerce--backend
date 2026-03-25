import User from "../models/user.js";
import bcrypt from "bcrypt";

export function createUser(req, res) {
    const newUserData = req.body;
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);
    user.save().then(() => {
        res.json({
            message: "User created successfully "
        });
    }).catch(() => {
        res.json({
            message: "Error creating User !!!"
        });
    });
}

export function loginUser(req, res) {
    User.find({ email: req.body.email }).then((users) => {
        if (users.length == 0) {
            res.json({
                message: "User not found !!!"
            });
        } else {
            const user = users[0];
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

            if (isPasswordCorrect) {
                res.json({
                    message: "Login successful !!!"
                });
            } else {
                res.json({
                    message: "Incorrect password !!!"
                });
            }
        }
    // FIX: Missing .catch() handler added
    }).catch((err) => {
        res.status(500).json({
            message: "Error during login !!!", error: err.message
        });
    });
}


export function deleteUser(req, res) {
    User.deleteOne({ email: req.params.email }).then(() => {
        res.json({
            message: "User deleted successfully !!!"
        });
    }).catch((err) => {
        res.status(500).json({
            message: "Error deleting User !!!", error: err.message
        });
    });
    
} 