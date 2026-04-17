import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";
import { registerRoutes, getRoute } from "./registry.js";
import { verifyToken } from "./middleware/auth.js";

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  registerRoutes(req.body);
  res.json({ message: "Routes Registered Successfully" });
});

app.use(async (req, res) => {
  try {
    if (req.path === "/register")
      return res.status(404).json({ message: "Not Found" });

    await new Promise((resolve, reject) => {
      verifyToken(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const target = getRoute(req.method, req.path);

    if (!target) return res.status(404).json({ message: "Route not found" });

    console.log("👉 Forwarding headers:", {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    });

    console.log("👉 Incoming headers:", req.headers);
    console.log("👉 Body:", req.body);

    const response = await axios({
      method: req.method,
      url: `${target}${req.originalUrl}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      data: req.body,
    });

    return res.status(response.status).json(response.data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    console.error("proxy error: ", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
