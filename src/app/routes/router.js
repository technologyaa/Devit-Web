import { createBrowserRouter } from "react-router";
import ChatPage from "@/pages/chat/ChatPage";
import DevelopersPage from "@/pages/developers/DevelopersPage";
import SignUp1Page from "@/pages/signup/SignUp1Page";
import SignUp2Page from "@/pages/signup/SignUp2Page";
import SignInPage from "@/pages/signin/SignInPage";
import HomePage from "@/pages/home/HomePage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ShopPage from "@/pages/shop/ShopPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import Layout from "@/widgets/layout/Layout/Layout";

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
    path: "/",
    Component: Layout,
    children: [
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
    ],
  },
]);
