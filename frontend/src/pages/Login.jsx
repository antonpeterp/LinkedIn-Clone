import React, { useState, useContext } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext.jsx";
import axios from "axios";
import { UserDataContext } from "../context/UserContext.jsx";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [show, setShow] = useState(false);
  const { serverURL } = useContext(authDataContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const { useData, setUserData } = useContext(UserDataContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(serverURL + "/api/auth/login", formData, {
        withCredentials: true,
      });
      setUserData(result.data);
      navigate("/");
      setErr("");
      setFormData({ email: "", password: "" });
    } catch (error) {
      setErr(error.response?.data?.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${serverURL}/api/auth/google`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Logo */}
      <div className="p-6 lg:p-8">
        <img
          src={logo}
          alt="LinkedIn logo"
          className="w-28 md:w-32 lg:w-36 cursor-pointer"
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Form */}
      <div className="flex justify-center items-start mt-8">
        <form
          className="bg-white w-[350px] md:w-[400px] p-6 rounded-lg shadow-md"
          onSubmit={handleLogin}
        >
          <h1 className="text-[30px] font-semibold mb-[30px] mt-[12px]">
            Login
          </h1>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
          />

          <div className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus-within:border-blue-500 relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full focus:outline-none"
            />
            <span
              className="absolute right-[18px] font-semibold text-[#0077B5] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {err && <p className="text-center text-red-500">{err}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition mt-[30px]"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-gray-300" />
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-[1px] bg-gray-300" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center mt-[10px]">
            Don't Have An Account ?
            <span
              className="text-[#0077B5] cursor-pointer ml-1"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
