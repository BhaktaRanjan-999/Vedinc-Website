import { env } from "./env";

if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const jwtConfig = {
    secret: env.JWT_SECRET,
    expiresIn: "7d",
};
