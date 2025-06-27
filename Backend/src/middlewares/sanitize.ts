import catchAsync from "../utils/catchAsync";

const sanitize = (obj: any) => {
  for (const key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitize(obj[key]);
    }
  }
};

const sanitizeMiddleware = catchAsync((req: any, res: any, next: any) => {
  if (req.body) {
    sanitize(req.body);
  }
  if (req.query) {
    sanitize(req.query);
  }
  if (req.params) {
    sanitize(req.params);
  }
  next();
});

export default sanitizeMiddleware;
