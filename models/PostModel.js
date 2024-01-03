import mongoose from "mongoose";
import {postSchemaName, userSchemaName} from "./names.js";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchemaName,
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(postSchemaName, PostSchema);
