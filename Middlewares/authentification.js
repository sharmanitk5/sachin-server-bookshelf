import jwt from "jsonwebtoken";
export const validatemiddleware = (req, res, next) => {
  try {
    let decode = jwt.verify(req.headers.token, process.env.PRIVATE_KEY);
    next();
  } catch {
    res.status(401);
    res.json("Not authorized");
  }
};
