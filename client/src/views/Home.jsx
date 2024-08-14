import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
// const socket = io("http://localhost:3000");
import SideBar from "../components/SideBar";
function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("User");
  const messageEndRef = useRef(null);

  // useEffect(() => {
  //   socket.on("message", (data) => {
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   });

  //   socket.emit("joinRoom", { roomId: "general", username });

  //   return () => {
  //     socket.off("message");
  //   };
  // }, [username]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { roomId: "general", username, message });
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className=" text-neutral-900 p-4 text-center text-2xl">
        Chat
      </header>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-md">
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className="bg-white p-4 border-t border-gray-300">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
      <SideBar />
    </div>
  );
}

export default Home;
