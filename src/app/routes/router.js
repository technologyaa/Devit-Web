import { createBrowserRouter } from "react-router";
import SignIn from "@/pages/signin/SignIn";
import SignUp1 from "@/pages/signup/SignUp1";
import SignUp2 from "@/pages/signup/SignUp2";
import Home from "@/pages/home/Home";
import Projects from "@/pages/projects/Projects";
import Chat from "@/pages/chat/Chat";
import Developers from "@/pages/developers/Developers";
import Shop from "@/pages/shop/Shop";
import Profile from "@/pages/profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/signup",
    children: [
      {
        path: "1",
        Component: SignUp1,
      },
      {
        path: "2",
        Component: SignUp2,
      },
    ],
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/projects",
    Component: Projects,
  },
  {
    path: "/chat",
    Component: Chat,
  },
  {
    path: "/offer/dev",
    Component: Developers,
  },
  {
    path: "/shop",
    Component: Shop,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
