import React from "react";
import router from "./routers";
import { RouterProvider } from "react-router-dom";
import { SocketProvider } from "./context/socketContext";
const App = () => {
  return (
    <>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </>
  );
};

export default App;
