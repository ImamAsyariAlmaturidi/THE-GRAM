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
    };
  }, [roomId, socketState]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0 w-2/4 bg-gray-200 p-4">
        <Call />
      </div>

      <div className="flex-1 flex flex-col  py-10">
        <div className="flex-shrink-0 text-black p-2 text-center font-semibold">
          Anonymous Chat
        </div>
        <div className="flex-1 overflow-auto p-2 bg-white rounded-t-lg shadow-md border-t border-gray-200">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {messages?.map((msg) => (
              <div
                className="flex flex-col mb-2 pb-2 border-b border-gray-200"
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
    </div>
  );
};

export default Chat;
