import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../views/Login";
import Home from "../views/Home";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Home />,
    loader: () => {
      if (!localStorage.username) {
        return redirect("/login");
      }
      return null;
    },
  },
]);

export default router;
