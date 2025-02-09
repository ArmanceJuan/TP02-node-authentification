import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    if (req.method === "GET") {
      return res.render("register");
    }

    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const errors = [];

    if (!firstName || !lastName || !email || !password) {
      return res.render("register", {
        error: "All fields are required",
        data: { firstName, lastName, email },
      });
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        error: "Passwords do not match",
        data: { firstName, lastName, email },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", {
        error: "This email is already used",
        data: { firstName, lastName, email },
      });
    }

    const hashedPassword = crypto
      .createHmac("sha256", process.env.HASH_SECRET)
      .update(password)
      .digest("hex");

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (err) {
    console.error("Erreur détaillée:", err);
    if (err.name === "ValidationError") {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res.render("register", {
        errors,
        data: req.body,
      });
    }

    res.render("register", {
      error: "Une erreur est survenue lors de l'inscription",
      data: req.body,
    });
  }
};

export const login = async (req, res) => {
  try {
    if (req.method === "GET") {
      return res.render("login");
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", {
        error: "Email et mot de passe requis",
        data: { email },
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password)) {
      return res.render("login", {
        error: "Email ou mot de passe incorrect",
        data: { email },
      });
    }

    req.session.userId = user._id;
    req.session.isLogged = true;

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Erreur détaillée:", err);
    res.render("login", {
      error: "Une erreur est survenue lors de la connexion",
      data: { email: req.body.email },
    });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
    res.redirect("/login");
  });
};

export const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect("/login");
    }

    return res.render("dashboard", { user });
  } catch (error) {
    console.error("Erreur dashboard:", error);
    return res.redirect("/login");
  }
};
