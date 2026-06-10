import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import logo2 from "../assets/logo2.svg";
import avatar from "../assets/avatar.png";
import { IoSearchSharp } from "react-icons/io5";
import { IoHomeSharp } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { FaBriefcase } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
import { BsBellFill } from "react-icons/bs";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
const Nav = () => {
  let navigate = useNavigate();
  let [activeSearch, setActiveSearch] = useState(false);
  let [showPopup, setShowPopup] = useState(false);
  let { userData, setUserData } = useContext(UserDataContext);
  let { serverUrl } = useContext(authDataContext);
  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="w-full h-[60px] bg-[white] fixed  top-0 shadow-lg flex justify-around items-center px-[10px] left-0 z-index-[99]">
        <div className="flex justify-around items-center gap-[10px] ">
          <div onClick={() => setActiveSearch(false)}>
            <img src={logo2} alt="logo" className="w-[40px]" />
          </div>
          {!activeSearch && (
            <div>
              <IoSearchSharp
                className="w-[24px] h-[24px] text-gray-600 lg:hidden"
                onClick={() => setActiveSearch(true)}
              />
            </div>
          )}

          <form
            className={`lg:w-[300px] w-[180px] h-[30px] lg:flex border border-[#E0E0E0] rounded-[30px] flex items-center gap-[10px] px-[10px] ${
              !activeSearch ? "hidden" : ""
            } `}
          >
            <div>
              <IoSearchSharp className="w-[24px] h-[24px] text-gray-600" />
            </div>
            <input
              type="text"
              className="w-[80%] h-full bg-transparent outline-none border-0"
              placeholder="Search"
            />
          </form>
        </div>
        <div className="flex justify-center items-center gap-[30px]">
          {showPopup && (
            <div className="w-[300px] min-h-[380px] bg-white shadow-lg absolute top-[84px] rounded-lg border border-[#E0E0E0] flex flex-col items-center p-[20px] gap-[20px]">
              <div className="w-[50px] h-[48px] rounded-full ">
                <img
                  src={userData.profileImage || avatar}
                  alt="default profile picture"
                />
              </div>
              <div className="text-[20px] font-semibold text-gray-700">{`${userData.firstName} ${userData.lastName}`}</div>

              <button className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]">
                View Profile
              </button>
              <div className="w-full h-[1px] bg-gray-700"></div>
              <div className="flex items-center justify-center text-gray-600">
                <HiUsers className="w-[22px] h-[22px] text-gray-600" />
                <div>My Networks</div>
              </div>
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#ff2d2d]"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}

          <div className=" flex-col flex items-center justify-center ">
            <IoHomeSharp />
            Home
          </div>
          <div className="lg:flex  flex-col items-center justify-center hidden">
            <HiUsers />
            My Network
          </div>
          <div className="lg:flex flex-col items-center justify-center hidden">
            <FaBriefcase />
            Jobs
          </div>
          <div className="lg:flex flex-col items-center justify-center hidden">
            <AiFillMessage />
            Message
          </div>
          <div className=" flex-col flex items-center justify-center ">
            <BsBellFill />
            Notifications
          </div>
          <div
            className="w-[50px] h-[48px] rounded-full"
            onClick={() => setShowPopup((prev) => !prev)}
          >
            <img
              src={userData.profileImage || avatar}
              alt="default profile picture"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
