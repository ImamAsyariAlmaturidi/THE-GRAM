import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { MdVideocam, MdVideocamOff, MdMic, MdMicOff } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Call() {
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

  const [room, setRoom] = useState([]);

  function handleChangeRoom(e, id) {
    e.preventDefault();
    navigate(`/chat/${id}`);
  }

  useEffect(() => {
    async function getRoom() {
      try {
        const { data } = await axios.get(
          "https://gram.imam-asyari.online/allrooms"
        );
        setRoom(data);
      } catch (error) {
        console.log(error);
      }
    }

    getRoom();
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia(
        { video: cameraEnabled, audio: microphoneEnabled },
        (mediaStream) => {
          localStreamRef.current = mediaStream;
          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();
          call.answer(mediaStream);
          call.on("stream", function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        }
      );
    });

    peerInstance.current = peer;
  }, [cameraEnabled, microphoneEnabled]);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia(
      { video: cameraEnabled, audio: microphoneEnabled },
      (mediaStream) => {
        localStreamRef.current = mediaStream;
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, mediaStream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      }
    );
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = !cameraEnabled));
      setCameraEnabled(!cameraEnabled);
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !microphoneEnabled));
      setMicrophoneEnabled(!microphoneEnabled);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Current user ID: {peerId}
      </h1>
      <div className="mb-4 flex flex-col md:flex-row">
        <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
          placeholder="Enter remote peer ID"
          className="p-2 border border-gray-300 rounded mr-2 mb-2 md:mb-0 md:flex-1"
        />
        <button
          onClick={() => call(remotePeerIdValue)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Call
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
        <div
          onClick={toggleCamera}
          className={`p-2 rounded-full border-2 ${
            cameraEnabled ? "bg-red-500" : "bg-green-500"
          } text-white cursor-pointer`}
        >
          {cameraEnabled ? (
            <MdVideocam className="w-6 h-6" />
          ) : (
            <MdVideocamOff className="w-6 h-6" />
          )}
        </div>
        <div
          onClick={toggleMicrophone}
          className={`p-2 rounded-full border-2 ${
            microphoneEnabled ? "bg-red-500" : "bg-green-500"
          } text-white cursor-pointer`}
        >
          {microphoneEnabled ? (
            <MdMic className="w-6 h-6" />
          ) : (
            <MdMicOff className="w-6 h-6" />
          )}
        </div>
      </div>
      <div className="relative w-full max-w-3xl h-80">
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover border-2 border-gray-300 rounded bg-black"
          autoPlay
        />
        <video
          ref={currentUserVideoRef}
          className="absolute bottom-4 right-4 w-32 h-20 border-2 border-gray-300 rounded bg-black"
          autoPlay
          muted
        />
      </div>
      <div className="text-md my-6 text-center">CHANGE ROOM?</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
        {room.map((item) => (
          <button
            key={item.id}
            onClick={(e) => handleChangeRoom(e, item.id)}
            className="p-4 bg-gray-200 text-black font-mono font-extrabold tracking-wide rounded-lg hover:bg-gray-300"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Call;
