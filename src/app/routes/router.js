import { createBrowserRouter } from "react-router";
import SignIn from "@/pages/signin/SignInPage";
import SignUp1 from "@/pages/signup/SignUp1Page";
import SignUp2 from "@/pages/signup/SignUp2Page";
import Home from "@/pages/home/HomePage";
import Projects from "@/pages/projects/ProjectsPage";
import Chat from "@/pages/chat/ChatPage";
import Developers from "@/pages/developers/DevelopersPage";
import Shop from "@/pages/shop/ShopPage";
import Profile from "@/pages/profile/ProfilePage";
import ChatPage from "@/pages/chat/ChatPage";
import DevelopersPage from "@/pages/developers/DevelopersPage";
import SignUp1Page from "@/pages/signup/SignUp1Page";
import SignUp2Page from "@/pages/signup/SignUp2Page";
import SignInPage from "@/pages/signin/SignInPage";
import HomePage from "@/pages/home/HomePage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ShopPage from "@/pages/shop/ShopPage";
import ProfilePage from "@/pages/profile/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/signup",
    children: [
      {
        path: "1",
        Component: SignUp1Page,
      },
      {
        path: "2",
        Component: SignUp2Page,
      },
    ],
  },
  {
    path: "/signin",
    Component: SignInPage,
  },
  {
    path: "/home",
    Component: HomePage,
  },
  {
    path: "/projects",
    Component: ProjectsPage,
  },
  {
    path: "/chat",
    Component: ChatPage,
  },
  {
    path: "/offer/dev",
    Component: DevelopersPage,
  },
  {
    path: "/shop",
    Component: ShopPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
]);
