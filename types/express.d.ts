import User from "@models/user";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    file?: Express.Multer.File & Express.MulterS3.File;
  }
}
