import { findUserByEmail } from "./auth.repo";
import { comparePassword } from "../../utils/hash";

export const loginUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(password, user.passwordHash);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};
