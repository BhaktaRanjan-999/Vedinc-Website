import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: "Too many requests, please try again later.",
    })
);

app.use(express.json());

// 👇 IMPORTANT
app.use("/api/users", userRoutes);

// existing routes
app.use("/api", routes);

// optional: serve uploaded images
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

export default app;