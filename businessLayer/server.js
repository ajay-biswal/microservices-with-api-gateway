import dotenv from "dotenv";
dotenv.config();


import express from "express";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { registerWithGateway } from "./registerRoutes.js";

const app = express();
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);


const mountedRoutes = [
    { basePath: "/auth", router: authRoutes },
    { basePath: "/tasks", router: taskRoutes }
];


app.listen(process.env.PORT, async()=>{
    console.log(`Server is running on ${process.env.PORT}`);

    await registerWithGateway(mountedRoutes);
})
