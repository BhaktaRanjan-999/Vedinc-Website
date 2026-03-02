import { sign, verify, Secret } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import { UserRole } from "@prisma/client";

type Payload = {
    id: string;
    role: UserRole;
};

export const signToken = (payload: Payload) => {
    return sign(
        payload as object,
        jwtConfig.secret as Secret,
        {
            expiresIn: jwtConfig.expiresIn,
        }
    );
};

export const verifyToken = (token: string): Payload => {
    return verify(
        token,
        jwtConfig.secret as Secret,
        { algorithms: ["HS256"] }
    ) as Payload;
};

