import React, { useContext, useState, useRef } from "react";
import Nav from "../components/Nav.jsx";
import avatar from "../assets/avatar.png";
import { UserDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { PiNotePencil } from "react-icons/pi";
import { IoMdAdd, IoMdImages } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import EditProfile from "../components/EditProfile.jsx";
import axios from "axios";
import {
  MdPublic,
  MdKeyboardArrowDown,
  MdVideoLibrary,
  MdOutlineInsertDriveFile,
  MdOutlineEmojiEmotions,
  MdMoreHoriz,
  MdArticle,
} from "react-icons/md";
import Post from "../components/Post.jsx";

const Home = () => {
  let { userData, setUserData, edit, setEdit, getPost } =
    useContext(UserDataContext);
  const { serverURL } = useContext(authDataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onOpenModal = () => setIsModalOpen(true);
  const onClose = () => {
    setIsModalOpen(false);
    setText("");
    setImages([]);
    setVideo(null);
    setPreviewUrls([]);
    setVideoPreview(null);
  };

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("description", text);
    images.forEach((img) => formData.append("images", img));
    if (video) formData.append("video", video);

    try {
      await axios.post(`${serverURL}/api/posts/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      await getPost(); // refresh feed after posting
      onClose();
    } catch (err) {
      console.error("Post failed:", err);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative">
      {edit && <EditProfile />}

      <Nav />

      <div className="w-full lg:w-[24%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative">
        <div className="w-[100%] h-[160px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor pointer">
          <img
            src={userData.coverImage || ""}
            alt=""
            className="w-full h-auto"
          />
          <PiNotePencil className="absolute right-[20px] top-[20px] w-[24px] h-[24px] text-white cursor-pointer" />
        </div>

        <div className="w-[80px] h-[80px] rounded-full overflow-hidden items-center justify-center relative top-[-30px] left-[34px]">
          <img
            src={userData.profileImage || avatar}
            alt="default profile picture"
            className="h-full"
          />
        </div>
        <div className="mt-text-[30px] ml-[28px] text-[18px] font-semibold text-gray-700">
          <div>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="text-[18px] text-gray-600">{`${
            userData.headline || ""
          }`}</div>
          <div className="text-[16px] text-gray-500">{`${userData.location}`}</div>
          <button
            className="bg-[#F4F2EE] flex border-2 border-dashed border-[#898888] mt-[8px] p-[4px] w-[76%] gap-[8px]"
            onClick={() => setEdit(true)}
          >
            <IoMdAdd className="w-[24px] h-[24px] text-gray-800" />
            Experience
          </button>
        </div>
      </div>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[552px] bg-white rounded-lg z-[200] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={userData.profileImage || avatar}
                    alt="default profile picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-black">
                    {`${userData.firstName} ${userData.lastName}`}
                  </div>
                  <div className="text-xs text-gray-500">Post to anyone</div>
                  <button className="flex items-center gap-1 mt-1 border border-blue-600 rounded-full px-2 py-[2px] text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
                    <MdPublic className="w-3 h-3" />
                    Anyone
                    <MdKeyboardArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <RxCross1 className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto max-h-[340px]">
              <textarea
                className="w-full min-h-[120px] outline-none border-none resize-none text-base text-black placeholder-gray-400"
                placeholder="What do you want to talk about?"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-[140px] object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                      >
                        <RxCross1 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {videoPreview && (
                <div className="relative mt-3 rounded-lg overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg max-h-[200px]"
                  />
                  <button
                    onClick={removeVideo}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                  >
                    <RxCross1 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <input
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={handleVideoChange}
              className="hidden"
            />

            <div className="border-t border-gray-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => imageInputRef.current.click()}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                    aria-label="Add photo"
                  >
                    <IoMdImages className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => videoInputRef.current.click()}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                    aria-label="Add video"
                  >
                    <MdVideoLibrary className="w-5 h-5" />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                    aria-label="Add document"
                  >
                    <MdOutlineInsertDriveFile className="w-5 h-5" />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                    aria-label="Add emoji"
                  >
                    <MdOutlineEmojiEmotions className="w-5 h-5" />
                  </button>
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
                    aria-label="More"
                  >
                    <MdMoreHoriz className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={!text.trim() && images.length === 0 && !video}
                  className="h-9 px-5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-default"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="w-full lg:w-[50%] min-h-[200px]">
        <div className="w-full bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={userData.profileImage || avatar}
                alt="default profile picture"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={onOpenModal}
              className="flex-1 h-12 border-[1.5px] border-gray-400 rounded-full text-left px-4 text-sm text-gray-500 hover:bg-gray-100 transition"
            >
              Start a post
            </button>
          </div>
          <div className="border-t border-gray-200 my-2" />
          <div className="flex items-center justify-around">
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition"
            >
              <IoMdImages className="w-5 h-5 text-blue-500" />
              Photo
            </button>
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition"
            >
              <MdVideoLibrary className="w-5 h-5 text-green-600" />
              Video
            </button>
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 px-3 py-2 rounded text-gray-500 text-sm font-semibold hover:bg-gray-100 transition"
            >
              <MdArticle className="w-5 h-5 text-yellow-600" />
              Write article
            </button>
          </div>
        </div>
        <Post />
      </div>

      <div className="w-[25%] min-h-[200px] bg-[white] shadow-lg"></div>
    </div>
  );
};

export default Home;
