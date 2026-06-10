import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;

    const images = req.files?.images || [];
    const videoFile = req.files?.video?.[0] || null;

    const imageUrls = await Promise.all(
      images.map((img) => uploadOnCloudinary(img.path))
    );

    let videoUrl = null;
    if (videoFile) {
      videoUrl = await uploadOnCloudinary(videoFile.path, "video");
    }

    const newPost = await Post.create({
      author: req.userId,
      description,
      images: imageUrls,
      video: videoUrl,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName profileImage headline") // referencing another model's property-populate
      .populate("comment.user", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
