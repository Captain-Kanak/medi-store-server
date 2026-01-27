import { UserRoles } from "@prisma/client";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Kanak Ray",
      email: "kanakroy835@gmail.com",
      password: "admin123",
      role: UserRoles.ADMIN,
    };

    // check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingAdmin) {
      throw new Error("Admin already exists in user table");
    }

    // sign up admin using better-auth api
    const result = await fetch("http://localhost:5000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify(adminData),
    });

    if (!result.ok) {
      throw new Error("Failed to seed admin");
    }

    const data = await result.json();
    const admin = data.user;

    // admin email verification
    const verifiedAdmin = await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        emailVerified: true,
      },
    });

    console.log("Seeded Admin:", verifiedAdmin);
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
