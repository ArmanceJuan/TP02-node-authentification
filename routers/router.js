import { Router } from "express";
import {
  register,
  login,
  logout,
  dashboard,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, dashboard);

router.get("/register", register);
router.post("/register", register);

router.post("/logout", logout);

router.get("/login", login);
router.post("/login", login);

router.get("/", (req, res) => {
  res.redirect("/login");
});

export default router;
