import 'dotenv/config';
import cors from 'cors';
import fs from 'fs';
import express from 'express';
import mongoose from "mongoose";
import multer from 'multer';

import { UserController, PostController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { registerValidation, loginValidation } from "./validations/auth.js";
import { postCreateValidation } from "./validations/post.js";

const mongodbUri = process.env.MONGODB_URI;
const serverPort = process.env.SERVER_PORT;

mongoose
  .connect(mongodbUri)
  .then(() => console.log('DB connected'))
  .catch((error) => console.log('Error DB connection:', error));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json()); // позволяет читать json в запросах
app.use(cors());
app.use('/uploads', express.static('uploads'));

// user routes
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// post routes
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/tags', PostController.getLastTags);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

// other routes
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(serverPort, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log('Express server is running');
});
