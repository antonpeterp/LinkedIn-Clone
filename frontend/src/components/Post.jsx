import React, { useContext, useState, useEffect } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import avatar from "../assets/avatar.png";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { LuSend } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { SocketContext } from "../context/SocketContext.jsx";

const timeAgo = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Post = () => {
  const { postData, setPostData, userData } = useContext(UserDataContext);
  const { serverURL } = useContext(authDataContext);
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const { socket } = useContext(SocketContext);
  useEffect(() => {
    if (!socket) return;
    socket.on("postUpdated", (updatedPost) => {
      setPostData((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    });
    return () => socket.off("postUpdated");
  }, [socket]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(
        `${serverURL}/api/posts/like/${postId}`,
        {},
        { withCredentials: true }
      );
      setPostData((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, like: res.data.likes } : p))
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      const res = await axios.post(
        `${serverURL}/api/posts/comment/${postId}`,
        { content },
        { withCredentials: true }
      );
      setPostData((prev) => prev.map((p) => (p._id === postId ? res.data : p)));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  if (!postData || postData.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg mt-3 p-6 text-center text-gray-400 text-sm">
        No posts yet. Be the first to post!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      {postData.map((post) => {
        const isLiked = post.like?.includes(userData?._id);
        const commentsOpen = openComments[post._id];

        return (
          <div
            key={post._id}
            className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={post.author?.profileImage || avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-black hover:underline cursor-pointer">
                    {`${post.author?.firstName} ${post.author?.lastName}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {post.author?.headline || ""}
                  </div>
                  <div className="text-xs text-gray-400">
                    {timeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition">
                <BsThreeDots className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            {post.description && (
              <div className="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                {post.description}
              </div>
            )}

            {/* Images */}
            {post.images?.filter(Boolean).length > 0 && (
              <div
                className={`grid gap-[2px] ${
                  post.images.filter(Boolean).length > 1
                    ? "grid-cols-2"
                    : "grid-cols-1"
                }`}
              >
                {post.images.filter(Boolean).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="post"
                    className="w-full object-cover max-h-[460px]"
                  />
                ))}
              </div>
            )}

            {/* Video */}
            {post.video && (
              <video
                src={post.video}
                controls
                className="w-full max-h-[460px] bg-black"
              />
            )}

            {/* Like/Comment counts */}
            {(post.like?.length > 0 || post.comment?.length > 0) && (
              <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
                {post.like?.length > 0 && (
                  <div className="flex items-center gap-1 hover:underline cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <AiFillLike className="text-white w-[10px] h-[10px]" />
                    </div>
                    <span>{post.like.length}</span>
                  </div>
                )}
                {post.comment?.length > 0 && (
                  <span
                    className="ml-auto hover:underline cursor-pointer"
                    onClick={() => toggleComments(post._id)}
                  >
                    {post.comment.length}{" "}
                    {post.comment.length === 1 ? "comment" : "comments"}
                  </span>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 mx-4" />

            {/* Action buttons */}
            <div className="flex items-center justify-around px-2 py-1">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center ${
                  isLiked ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {isLiked ? (
                  <AiFillLike className="w-5 h-5 text-blue-600" />
                ) : (
                  <AiOutlineLike className="w-5 h-5" />
                )}
                Like
              </button>
              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center"
              >
                <BiComment className="w-5 h-5" />
                Comment
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center">
                <PiShareFatLight className="w-5 h-5" />
                Repost
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center">
                <LuSend className="w-5 h-5" />
                Send
              </button>
            </div>

            {/* Comments section */}
            {commentsOpen && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
                {/* Comment input */}
                <div className="flex items-center gap-2">
                  <img
                    src={userData?.profileImage || avatar}
                    alt="me"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={commentInputs[post._id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCommentSubmit(post._id);
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post._id)}
                    className="text-blue-500 text-sm font-semibold hover:text-blue-700"
                  >
                    Post
                  </button>
                </div>

                {/* Existing comments */}
                {post.comment?.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <img
                      src={c.user?.profileImage || avatar}
                      alt="commenter"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm">
                      <div className="font-semibold text-gray-800">
                        {c.user?.firstName} {c.user?.lastName}
                      </div>
                      <div className="text-gray-700">{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Post;
