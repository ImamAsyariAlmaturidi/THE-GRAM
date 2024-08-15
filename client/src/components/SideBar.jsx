import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socketContext";

const SideBar = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
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
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-neutral-900 text-white transition-transform -translate-x-full sm:translate-x-0">
      <div className="h-full px-4 py-6 overflow-y-auto bg-neutral-900">
        <ul className="space-y-4 font-medium">
          {rooms.map((room) => {
            const latestMessage = room.Messages[room.Messages.length - 1];
            return (
              <li
                key={room.id}
                onClick={(e) => joinChat(e, room.id)}
                className="bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
              >
                <a className="flex items-center p-4 text-white hover:bg-gray-600 rounded-lg transition-colors">
                  <span className="flex-1 truncate">{room.name}</span>
                </a>
                <div className="p-2 text-gray-400 text-sm flex">
                  <div className="p-2 text-gray-500 text-xs italic ">
                    Unknown
                  </div>
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
  );
};

export default SideBar;
