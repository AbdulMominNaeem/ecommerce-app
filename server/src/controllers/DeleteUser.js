const User = require("../models/User");

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Access denied" });
    }

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "You do not have permission to delete this user" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteUser;
