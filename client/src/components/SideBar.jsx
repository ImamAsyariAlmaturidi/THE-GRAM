import axios from "axios";
import React, { useEffect, useState } from "react";

const SideBar = () => {
  const [rooms, setRooms] = useState([]);

  async function getRooms() {
    try {
      const { data } = await axios.get("http://localhost:3000/allrooms");
      setRooms(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
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
                className="bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
              >
                <a
                  href="#"
                  className="flex items-center p-4 text-white hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span className="flex-1 truncate">{room.name}</span>
                </a>
                <div className="p-2 text-gray-400 text-sm flex">
                  <div className="p-2 text-gray-500 text-xs italic ">
                    {latestMessage ? latestMessage.User.username : "Unknown"}
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
