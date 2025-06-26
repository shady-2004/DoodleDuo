// types/express/index.d.ts
import { AuthenticatedUser } from "./user"; // Adjust path

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
