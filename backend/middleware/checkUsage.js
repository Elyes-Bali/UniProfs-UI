import { User } from "../models/user.model.js";

export const checkUsage = async (req, res, next) => {
  try {
    const userId = req.user?._id; // requires verifyToken before this middleware
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    // If not paid & already used 3 times → block
    if (!user.hasPaid && user.usageCount >= 3) {
      return res.status(403).json({
        error: "Usage limit reached. Upgrade your plan to continue.",
      });
    }

    // Increment count (only if not paid)
    if (!user.hasPaid) {
      user.usageCount += 1;
      await user.save();
    }

    next();
  } catch (error) {
    console.log("Error in checkUsage middleware:", error);
    res.status(500).json({ error: "Server error" });
  }
};
