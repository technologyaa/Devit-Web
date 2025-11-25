import { createBrowserRouter } from "react-router";
import ChatPage from "@/pages/chat/ChatPage";
import DevelopersPage from "@/pages/developers/DevelopersPage";
import SignUp1Page from "@/pages/signup/SignUp1Page";
import SignUp2Page from "@/pages/signup/SignUp2Page";
import SignInPage from "@/pages/signin/SignInPage";
import HomePage from "@/pages/home/HomePage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ProjectsDetailPage from "@/pages/projects/ProjectsDetailPage";
import TaskDetailPage from "@/pages/tasks/TaskDetailPage";
import ShopPage from "@/pages/shop/ShopPage";
import CreditPage from "@/pages/shop/Credit";
import ProfilePage from "@/pages/profile/ProfilePage";
import Layout from "@/widgets/layout/Layout/Layout";
import ErrorPage from "@/pages/errorpage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/signup",
    children: [
      { path: "1", Component: SignUp1Page },
      { path: "2", Component: SignUp2Page },
    ],
  },
  {
    path: "/signin",
    Component: SignInPage,
  },
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        path: "/home",
        Component: HomePage,
      },
      {
        path: "/projects",
        children: [
          {
            index: true,
            Component: ProjectsPage,
          },
          {
            path: ":projectId",
            children: [
              {
                index: true,
                Component: ProjectsDetailPage,
              },
              {
                path: "tasks/:taskId",
                Component: TaskDetailPage,
              },
            ],
          },
        ],
      },
      { path: "/chat", Component: ChatPage },
      { path: "/offer/dev", Component: DevelopersPage },
      { path: "/shop", Component: ShopPage },
      { path: "/profile", Component: ProfilePage },
      { index: true, Component: HomePage },
    ],
  },
]);
