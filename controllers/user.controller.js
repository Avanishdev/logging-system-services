const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Log = require("../models/log.model");
const jwt = require('jsonwebtoken');

// Helper function to get IP address
const getIpAddress = (req) => {
    return (
        req.headers['x-forwarded-for'] || // Check for proxy headers
        req.connection.remoteAddress || // Fallback for non-proxy
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null)
    );
};

// Helper function to get user agent and other details
const getUserAgent = (req) => {
    return req.headers['user-agent']; // Browser, OS, etc.
};

const getAdditionalData = (req) => {
    const additionalData = {
        web: getUserAgent(req),
        ipAddress: getIpAddress(req)
    };
    return additionalData;
}

exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).send("User registered successfully.");
    } catch (error) {
        res.status(500).send("Error registering user.");
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).send("Invalid credentials.");
        }
        const token = jwt.sign({ _id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const newLog = new Log({
            actionType: 'Login',
            userId: user._id,
            role: user.role,
            additionalData: getAdditionalData(req),
        });

        await newLog.save();

        res.json({ user, token, newLog });
    } catch (error) {
        res.status(500).send("Error logging in user.");
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).send("No token provided.");

        //To do invalidate token

        const newLog = new Log({
            actionType: 'Logout',
            userId: req.user._id,
            role: req.user.role,
            additionalData: getAdditionalData(req),
        });

        await newLog.save();

        res.status(200).send("Logout successful.");
    } catch (error) {
        res.status(500).send("Error logging out.");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { newUserName } = req.body;

        const user = await User.findByIdAndUpdate(req.user._id, { username: newUserName }, { new: true });

        if (!user) return res.status(404).send("User not found");

        const newLog = new Log({
            actionType: 'Update',
            userId: req.user._id,
            role: req.user.role,
            additionalData: getAdditionalData(req),
        });

        await newLog.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Error updating profile.");
    }
};

