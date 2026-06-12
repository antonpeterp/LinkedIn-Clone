import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "./UserContext.jsx";

export const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    if (!userData) return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register", userData._id);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [userData]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
