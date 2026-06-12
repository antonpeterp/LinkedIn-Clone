import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/UserContext.jsx";
import SocketContextProvider from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </UserContext>
    </AuthContext>
  </BrowserRouter>
);
