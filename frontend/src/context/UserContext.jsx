import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const { serverURL } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverURL + "/api/user/currentUser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
    }
  };

  const getPost = async () => {
    try {
      const result = await axios.get(serverURL + "/api/posts/getpost", {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
