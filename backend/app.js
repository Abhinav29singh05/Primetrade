import express from "express";
import core from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import taskRoutes from "./routes/task.js";
import adminRoutes from "./routes/admin.js";

const app=express();
connectDB();

dotenv.config();


app.use(express.json());
app.use(core());

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);


app.listen(process.env.PORT || 5000,()=>{
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

export default app;