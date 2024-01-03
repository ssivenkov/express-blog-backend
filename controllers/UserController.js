import 'dotenv/config';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const secretKey = process.env.SECRET_KEY;

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const mongoDocument = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await mongoDocument.save();

    const token = jwt.sign(
      { _id: user._id, },
      secretKey,
      { expiresIn: '30d' }
    );
    // Данные в JWT передаются практически в открытом виде и раскодировать их может любой. Но шифровать их нет необходимости. Цель JWT токена - подтвердить, что эти данные не были изменены. Вот для этих целей и нужна сигнатура - третья часть JWT токена.
    // secretKey - секретный ключ, может быть любым, должен храниться только на сервере. На основе этого ключа создаётся сигнатура, которая записывается в JWT токен. В дальнейшем при получении сервером любого JWT токена сервер будет проверять, что сигнатура в этом JWT токене была создана именно с помощью этого секретного ключа

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Ошибка регистрации"
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Неверный логин или пароль"
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      secretKey,
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token
    }); // для чего нужно создавать новый токен?
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось авторизоваться"
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден"
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Нет доступа"
    });
  }
};
