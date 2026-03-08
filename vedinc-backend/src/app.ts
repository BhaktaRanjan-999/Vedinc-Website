import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./modules/user/user.routes";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        credentials: true,
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        standardHeaders: true,
        legacyHeaders: false,
        message: "Too many requests, please try again later.",
    })
);

app.use(express.json({ limit: "10mb" }));

app.get("/health", (_, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);