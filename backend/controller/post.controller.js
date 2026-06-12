import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Notification from "../models/notification.model.js";
import { io, onlineUsers } from "../index.js";

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
      .populate("author", "firstName lastName profileImage headline")
      .populate("comment.user", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.like.includes(req.userId);

    if (alreadyLiked) {
      post.like = post.like.filter((id) => id.toString() !== req.userId);
    } else {
      post.like.push(req.userId);

      // don't notify if user likes their own post
      if (post.author.toString() !== req.userId) {
        const notification = await Notification.create({
          recipient: post.author,
          sender: req.userId,
          type: "like",
          post: post._id,
          message: "liked your post",
        });

        // if post author is online, push it instantly
        const recipientSocketId = onlineUsers.get(post.author.toString());
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newNotification", notification);
        }
      }
    }

    await post.save();
    return res.status(200).json({ likes: post.like });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comment.push({ content, user: req.userId });
    await post.save();

    if (post.author.toString() !== req.userId) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.userId,
        type: "comment",
        post: post._id,
        message: "commented on your post",
      });

      const recipientSocketId = onlineUsers.get(post.author.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newNotification", notification);
      }
    }

    const updatedPost = await Post.findById(req.params.postId)
      .populate("author", "firstName lastName profileImage headline")
      .populate("comment.user", "firstName lastName profileImage");

    io.emit("postUpdated", updatedPost);

    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
