import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { envConfig } from "../config/envConfig.js";
import { UserRoles } from "@prisma/client";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: envConfig.app_user,
    pass: envConfig.app_pass,
  },
});

export const auth = betterAuth({
  baseURL: envConfig.better_auth_url as string,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [envConfig.origin_url as string, "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRoles.CUSTOMER,
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${envConfig.origin_url}/verify-email?token=${token}`;

        await transporter.sendMail({
          from: '"Medi Store" <support@medi-store.com>',
          to: user.email,
          subject: "Please verify your email",
          html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <title>Email Verification</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 40px 0;">
                        <table
                          width="600"
                          cellpadding="0"
                          cellspacing="0"
                          style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);"
                        >
                          <!-- Header -->
                          <tr>
                            <td align="center" style="padding: 30px 20px; border-bottom: 1px solid #eeeeee;">
                              <h1 style="margin: 0; color: #333333;">Medi Store</h1>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding: 30px 40px; color: #555555;">
                              <h2 style="margin-top: 0; color: #333333;">Verify your email address</h2>

                              <p>
                                Hi <strong>${user.name}</strong>,
                              </p>

                              <p>
                                Thank you for signing up for <strong>Medi Store</strong>.
                                Please confirm your email address by clicking the button below.
                              </p>

                              <div style="text-align: center; margin: 30px 0;">
                                <a
                                  href="${url}"
                                  style="
                                    background-color: #4f46e5;
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 14px 28px;
                                    border-radius: 6px;
                                    display: inline-block;
                                    font-weight: bold;
                                    "
                                >
                                  Verify Email
                                </a>
                              </div>

                              <p>
                                If the button doesn’t work, copy and paste the following link into your browser:
                              </p>

                              <p style="word-break: break-all; color: #4f46e5;">
                                ${verificationUrl}
                              </p>

                              <p style="margin-top: 30px;">
                                This verification link will expire soon for security reasons.
                              </p>

                              <p>
                                If you did not create an account, you can safely ignore this email.
                              </p>

                              <p style="margin-top: 40px;">
                                Regards,<br />
                                <strong>Medi Store Team</strong>
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td
                              align="center"
                              style="padding: 20px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;"
                            >
                              © 2026 Blog Application. All rights reserved.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Could not send verification email");
      }
    },
  },
  socialProviders: {
    google: {
      clientId: envConfig.google_client_id as string,
      clientSecret: envConfig.google_client_secret as string,
    },
  },
});
