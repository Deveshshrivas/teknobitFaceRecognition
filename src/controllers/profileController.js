const User = require('../models/userModel');

class ProfileController {
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
}

module.exports = new ProfileController();