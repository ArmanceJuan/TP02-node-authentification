import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (!req.session.isLogged) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (err) {
    res.redirect("/login");
  }
};
