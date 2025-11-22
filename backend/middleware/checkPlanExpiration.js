import { User } from "../models/user.model.js";

export const checkPlanExpiration = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.hasPaid && user.planExpiresAt) {
    const now = new Date();
    if (now > user.planExpiresAt) {
      // Expired
      user.hasPaid = false;
      user.paidPlan = "Free";
      user.planExpiresAt = null;
      await user.save();
    }
  }

  next();
};