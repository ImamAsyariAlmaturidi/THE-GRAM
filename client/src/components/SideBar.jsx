import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function getRooms() {
    try {
      const { data } = await axios.get("http://localhost:3000/allrooms");
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  }

  async function joinChat(e, id) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/joinroom/${id}?username=${localStorage.username}`
      );
      console.log(response);
      navigate(`/chat/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <div>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 text-white p-2 bg-blue-500 rounded-md sm:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-neutral-900 text-white transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto bg-neutral-900">
          <ul className="space-y-4 font-medium">
            {rooms.map((room) => {
              const latestMessage = room.Messages[room.Messages.length - 1];
              return (
                <li
                  key={room.id}
                  onClick={(e) => joinChat(e, room.id)}
                  className="bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 cursor-pointer"
                >
                  <a className="flex items-center p-4 text-white hover:bg-gray-600 rounded-lg transition-colors">
                    <span className="flex-1 truncate">{room.name}</span>
                  </a>
                  <div className="p-2 text-gray-400 text-sm">
                    <div className="text-gray-500 text-xs italic">Unknown</div>
                    <p className="text-xs mt-2 truncate">
                      {latestMessage ? latestMessage.message : "No messages"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
