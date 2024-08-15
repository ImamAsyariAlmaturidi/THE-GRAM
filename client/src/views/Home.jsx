import React, { useState, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
function Home() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center gap-4 items-center bg-neutral-900">
      <div
        className="h-5/6 w-1/3"
        style={{ background: "url('../src/assets/robot.gif')" }}
      ></div>
      <div>
        <h1 className="pl-20 text-white text-2xl">
          Please select a chat to Start messaging.
        </h1>
      </div>
      <SideBar />
    </div>
  );
}

export default Home;
