import { UserRoles } from "@prisma/client";
import { auth } from "../lib/auth";
import { AppError } from "../utils/AppError";

export const authMiddleware = (...roles: UserRoles[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      // get user session
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      // check session and user exists
      if (!session || !session.user) {
        throw new AppError("Unauthorized", 401);
      }

      // check user email verified or not
      if (!session.user.emailVerified) {
        throw new AppError("Email not verified", 401);
      }

      // check user role
      if (roles.length > 0 && !roles.includes(session.user.role as UserRoles)) {
        throw new AppError("Forbidden", 403);
      }

      // set user to the request
      req.user = session.user;

      next();
    } catch (error) {
      console.log(error);

      if (error instanceof AppError) {
        throw error;
      }

      next(error);
    }
  };
};
