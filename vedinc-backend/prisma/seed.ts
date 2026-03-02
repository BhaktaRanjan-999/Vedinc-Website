import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";
import { UserRole } from "@prisma/client";

async function main() {
    // 🔐 SUPER ADMIN
    const superAdminEmail = "admin@vedinc.in";
    const superAdminPassword = "admin123";

    const superAdminExists = await prisma.user.findUnique({
        where: { email: superAdminEmail },
    });

    if (!superAdminExists) {
        const adminHash = await bcrypt.hash(superAdminPassword, 10);

        await prisma.user.create({
            data: {
                name: "Super Admin",
                email: superAdminEmail,
                passwordHash: adminHash,
                role: UserRole.SUPER_ADMIN, // ✅ IMPORTANT
            },
        });

        console.log("✅ Super Admin created");
    } else {
        console.log("ℹ️ Super Admin already exists");
    }

    // 👤 NORMAL USER
    const userEmail = "user@vedinc.in";
    const userPassword = "user@123";

    const userExists = await prisma.user.findUnique({
        where: { email: userEmail },
    });

    if (!userExists) {
        const userHash = await bcrypt.hash(userPassword, 10);

        await prisma.user.create({
            data: {
                name: "Test User",
                email: userEmail,
                passwordHash: userHash,
                role: UserRole.USER,
            },
        });

        console.log("✅ User created");
    } else {
        console.log("ℹ️ User already exists");
    }
}

main()
    .catch((err) => {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
