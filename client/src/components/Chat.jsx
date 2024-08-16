import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import Call from "./Call";
import SideBar from "./SideBar";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { roomId } = useParams();
  const { socketState } = useContext(SocketContext);
  const endOfMessagesRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const newMessage = {
        message,
        roomId,
        User: { username: "Anonymous" },
      };

      socketState?.emit("sendMessage", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await axios.post(
        `https://gram.imam-asyari.online/message/${roomId}?username=${localStorage.username}`,
        {
          message,
        }
      );

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const { data } = await axios.get(
          `https://gram.imam-asyari.online/message/${roomId}`
        );

        const anonymousMessages = data.map((msg) => ({
          ...msg,
          User: { username: "Anonymous" },
          createdAt: undefined,
        }));

        setMessages(anonymousMessages);
      } catch (error) {
        console.log(error);
      }
    };

    getAllMessages();

    socketState?.emit("join-room", { username: localStorage.username, roomId });

    socketState?.on("message", (newMessage) => {
      const formattedMessage = Array.isArray(newMessage)
        ? newMessage.map((msg) => ({
            ...msg,
            User: { username: "Anonymous" },
            createdAt: undefined,
          }))
        : {
            ...newMessage,
            User: { username: "Anonymous" },
            createdAt: undefined,
          };

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      socketState?.off("message");
      socketState?.disconnect();
    };
  }, [roomId, socketState]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <div className="md:flex-shrink-0 md:w-2/5 lg:w-1/3 bg-gray-200 p-4">
        <Call />
      </div>

      <div className="flex-1 flex flex-col py-4 md:py-10">
        <div className="flex-shrink-0 text-black p-2 text-center font-semibold bg-blue-100 rounded-t-lg shadow">
          Anonymous Chat
        </div>
        <div className="flex-1 overflow-auto p-2 bg-white rounded-t-lg shadow-md border-t border-gray-200">
          <div className="max-h-[calc(100vh-250px)] overflow-y-auto space-y-3 p-3">
            {messages?.map((msg) => (
              <div
                className={`flex flex-col mb-2 pb-2 rounded-lg ${
                  msg.User.username === "You"
                    ? "bg-blue-50 self-end"
                    : "bg-gray-100"
                } p-3 shadow`}
                key={msg.id}
              >
                <span className="font-semibold text-gray-800">
                  {msg.User.username}
                </span>
                <div className="text-gray-600">{msg.message}</div>
              </div>
            ))}
            <div ref={endOfMessagesRef} /> {/* For auto-scrolling */}
          </div>
        </div>
        <form
          className="flex p-2 border-t border-gray-200 bg-white"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
