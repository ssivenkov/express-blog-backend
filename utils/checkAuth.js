import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);

      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "Нет доступа"
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа"
    });
  }
}
