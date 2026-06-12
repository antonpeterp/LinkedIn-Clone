import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import avatar from "../assets/avatar.png";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

const RightSidebar = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  const { serverURL } = useContext(authDataContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [connections, setConnections] = useState([]);

  const getSuggestedUsers = async () => {
    try {
      const res = await axios.get(`${serverURL}/api/user/suggested`, {
        withCredentials: true,
      });
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch suggested users:", err);
    }
  };

  useEffect(() => {
    getSuggestedUsers();
    if (userData?.connection) {
      setConnections(userData.connection);
    }
  }, [userData]);

  const handleConnect = async (targetUserId) => {
    try {
      const res = await axios.post(
        `${serverURL}/api/user/connect/${targetUserId}`,
        {},
        { withCredentials: true }
      );
      setConnections(res.data.connection);
      // update userData context so other components reflect the change
      setUserData((prev) => ({ ...prev, connection: res.data.connection }));
    } catch (err) {
      console.error("Connect failed:", err);
    }
  };

  return (
    <div className="w-full lg:w-[25%] flex flex-col gap-3">
      {/* Suggested Users Card */}
      <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">
            People you may know
          </h3>
        </div>

        <div className="flex flex-col">
          {suggestedUsers.length === 0 && (
            <div className="px-4 pb-4 text-xs text-gray-400">
              No suggestions right now.
            </div>
          )}

          {suggestedUsers.map((user) => {
            const isConnected = connections
              .map((id) => id.toString())
              .includes(user._id.toString());

            return (
              <div
                key={user._id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={user.profileImage || avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info + button */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="text-sm font-semibold text-black truncate">
                    {`${user.firstName} ${user.lastName}`}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.headline || "LinkedIn Member"}
                  </div>

                  <button
                    onClick={() => handleConnect(user._id)}
                    className={`mt-2 flex items-center justify-center gap-1 w-full border rounded-full py-1 text-xs font-semibold transition ${
                      isConnected
                        ? "border-gray-400 text-gray-500 hover:bg-gray-100"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <RxCross1 className="w-3 h-3" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <IoMdAdd className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3">
          <button className="text-sm font-semibold text-gray-500 hover:text-black transition w-full text-center">
            Show more
          </button>
        </div>
      </div>

      {/* Footer links — just like LinkedIn */}
      <div className="px-2 flex flex-wrap gap-x-2 gap-y-1">
        {[
          "About",
          "Accessibility",
          "Help Center",
          "Privacy & Terms",
          "Ad Choices",
          "Advertising",
          "Business Services",
          "Get the LinkedIn app",
          "More",
        ].map((link) => (
          <span
            key={link}
            className="text-[11px] text-gray-400 hover:underline cursor-pointer"
          >
            {link}
          </span>
        ))}
        <span className="text-[11px] text-gray-400 mt-1 w-full">
          LinkedIn Corporation © 2026
        </span>
      </div>
    </div>
  );
};

export default RightSidebar;
