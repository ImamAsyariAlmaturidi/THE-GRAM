import React, { useState, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
function Home() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="main-container">
        <div className="text-center text-3xl ml-80 tracking-widest flex justify-center text-white items-center h-[100vh] bg-black">
          SELECT CHAT TO JOIN
        </div>
      </div>
      <SideBar />
    </div>
  );
}

export default Home;
