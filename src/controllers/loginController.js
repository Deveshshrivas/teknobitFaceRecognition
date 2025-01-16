const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    constructor() {
        this.handleLogin = this.handleLogin.bind(this);
    }

    async handleLogin(req, res) {
        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = new LoginController();