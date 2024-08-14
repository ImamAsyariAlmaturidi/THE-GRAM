// src/components/Chat.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext"; // Pastikan nama ini sesuai dengan ekspor
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { roomId } = useParams();

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/message/${roomId}`
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on("message", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [socket, roomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await axios.post(
      `http://localhost:3000/message/${roomId}?username=${localStorage.username}`,
      { message }
    );
    if (socket) {
      const messageData = {
        roomId,
        username: localStorage.getItem("username"),
        message,
      };
      socket.emit("sendMessage", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
    } else {
      console.error("Socket is not initialized");
    }
  };

  return (
    <div className="flex flex-col p-4 max-h-[80vh] overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex-1">
        {messages?.map((msg, index) => (
          <div
            className="flex flex-col mb-4 pb-2 border-b border-gray-200"
            key={index}
          >
            <span className="font-semibold text-gray-800">{msg.username}</span>
            <div className="text-gray-600">{msg.message}</div>
          </div>
        ))}
      </div>
      <form className="flex mt-4" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
