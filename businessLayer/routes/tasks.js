import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );
    console.log("BODY:", req.body);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "DB Error" });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// READ ONE
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;