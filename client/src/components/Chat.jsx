import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import axios from "axios";
import Call from "./Call";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { roomId } = useParams();
  const { socketState } = useContext(SocketContext);

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
        `http://localhost:3000/message/${roomId}?username=${localStorage.username}`,
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
          `http://localhost:3000/message/${roomId}`
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
      console.log(formattedMessage);
    });

    return () => {
      socketState?.off("message");
    };
  }, [roomId, socketState]);

  return (
    <div className="flex flex-col p-4 max-h-[80vh] overflow-y-auto border border-gray-200 rounded-lg bg-gray-50">
      <Call />
      {messages?.map((msg) => (
        <div className="flex-1" key={msg.id}>
          <div
            className="flex flex-col mb-4 pb-2 border-b border-gray-200"
            key={msg.id}
          >
            <span className="font-semibold text-gray-800">Anonymous</span>
            <div className="text-gray-600">{msg.message}</div>
          </div>
        </div>
      ))}
      <form className="flex mt-4" onSubmit={sendMessage}>
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
