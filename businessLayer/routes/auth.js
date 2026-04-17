import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    [username, password]
  );

  res.json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username=$1 AND password=$2",
    [username, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];

  const token = jwt.sign({ id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {expiresIn: "1h"}
  );

  res.json({token});
});

export default router;
