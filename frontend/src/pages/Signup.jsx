import React, { useState, useContext } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
const Signup = () => {
  const [show, setShow] = useState(false);
  const { serverURL } = useContext(authDataContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const { UserData, setUserData } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(serverURL + "/api/auth/signup", formData, {
        withCredentials: true,
      });
      console.log(result);
      setUserData(result.data);
      navigate("/");
      setErr("");
      setLoading(false);
      // clear form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
      });
    } catch (error) {
      setErr(error.response.data.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Logo Section */}
      <div className="p-6 lg:p-8">
        <img
          src={logo}
          alt="LinkedIn logo"
          className="w-28 md:w-32 lg:w-36 cursor-pointer"
          onClick={() => navigate("/signup")}
        />
      </div>

      {/* Signup Form Section */}
      <div className="flex justify-center items-start mt-8">
        <form
          className="bg-white w-[350px] md:w-[400px] p-6 rounded-lg shadow-md"
          onSubmit={handleSignup}
        >
          <h1 className="text-[30px] font-semibold mb-[30px] mt-[12px]">
            Sign Up
          </h1>

          <input
            type="text"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="userName"
            placeholder="Enter Username"
            value={formData.userName}
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

          {err && <p className="text-center text-red-500"> {err}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition mt-[30px]"
          >
            Sign Up
          </button>

          <p className="text-center mt-[10px]">
            Already Have An Account ?
            <span
              className="text-[#0077B5] cursor-pointer ml-1"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
