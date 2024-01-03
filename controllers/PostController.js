import PostModel from '../models/PostModel.js';

export const getAll = async (req, res) => {
  try {
    // подключение связи(связей) из другой таблицы в базе; 'user' - ключ с нужной связью в указанной модели
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось получить статьи"
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
    ).populate('user').exec();

    if (!updatedPost) {
      return res.status(404).json({
        message: 'Статья не найдена'
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось получить статью"
    });
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map(post => post.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось получить статьи"
    });
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findOneAndDelete({ _id: postId }).exec();

    if (!deletedPost) {
      return res.status(404).json({
        message: 'Статья не найдена'
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось удалить статью"
    });
  }
}

export const create = async (req, res) => {
  try {
    const mongoDocument = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await mongoDocument.save();

    res.json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось создать статью"
    });
  }
};

export const update =  async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Не удалось обновить статью"
    });
  }
}
