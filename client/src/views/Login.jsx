import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://gram.imam-asyari.online/login",
        {
          username,
        }
      );
      localStorage.setItem("username", data.user.username);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ background: "url('../src/assets/Photo2.png')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <img src={Logo} alt="logo" className="pb-70 -mt-10" />
        <h2 className="text-2xl font-bold text-center -mt-20">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 sm:text-sm bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-transparent text-black py-2 px-4 rounded-lg hover:bg-black border border-black hover:text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
