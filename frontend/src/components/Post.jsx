import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import avatar from "../assets/avatar.png";
import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { PiShareFatLight } from "react-icons/pi";
import { LuSend } from "react-icons/lu";

const Post = () => {
  const { postData } = useContext(UserDataContext);

  if (!postData || postData.length === 0) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg mt-3 p-6 text-center text-gray-400 text-sm">
        No posts yet. Be the first to post!
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-3">
      {postData.map((post) => (
        <div
          key={post._id}
          className="w-full bg-white border border-gray-200 rounded-lg"
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
                <div className="text-sm font-semibold text-black">
                  {`${post.author?.firstName} ${post.author?.lastName}`}
                </div>
                <div className="text-xs text-gray-500">
                  {post.author?.headline || ""}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Post Description */}
          {post.description && (
            <div className="px-4 pb-3 text-sm text-gray-800 whitespace-pre-wrap">
              {post.description}
            </div>
          )}

          {/* Images */}
          {post.images?.length > 0 && (
            <div
              className={`grid gap-1 ${
                post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
              }`}
            >
              {post.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="post"
                  className="w-full object-cover max-h-[400px]"
                />
              ))}
            </div>
          )}

          {/* Video */}
          {post.video && (
            <video
              src={post.video}
              controls
              className="w-full max-h-[400px] object-cover"
            />
          )}

          {/* Like/Comment counts */}
          {(post.like?.length > 0 || post.comment?.length > 0) && (
            <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
              {post.like?.length > 0 && (
                <span>
                  {post.like.length} {post.like.length === 1 ? "like" : "likes"}
                </span>
              )}
              {post.comment?.length > 0 && (
                <span>
                  {post.comment.length}{" "}
                  {post.comment.length === 1 ? "comment" : "comments"}
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-around px-2 py-1">
            <button className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center">
              <AiOutlineLike className="w-5 h-5" />
              Like
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition flex-1 justify-center">
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
        </div>
      ))}
    </div>
  );
};

export default Post;
