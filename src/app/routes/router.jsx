import Cookies from "js-cookie";
import { createBrowserRouter, redirect } from "react-router-dom";
import ChatPage from "@/pages/chat/ChatPage";
import DevelopersPage from "@/pages/developers/DevelopersPage";
import SignUpPage from "@/pages/signup/SignUpPage";
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

const authLoader = () => {
  const token = Cookies.get("accessToken");

  if (!token) {
    return redirect("/signin");
  }

  return null;
}

export const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/projects",
        children: [
          {
            index: true,
            element: <ProjectsPage />,
          },
          {
            path: ":projectId",
            children: [
              {
                index: true,
                element: <ProjectsDetailPage />,
              },
              {
                path: "tasks/:taskId",
                element: <TaskDetailPage />,
              },
            ],
          },
        ],
      },
      { path: "/chat", element: <ChatPage /> },
      { path: "/offer/dev", element: <DevelopersPage /> },
      { 
        path: "/shop", 
        children: [
          {
            index: true,
            element: <ShopPage />
          },
          {
            path: ":credit",
            element: <CreditPage/>
          }
        ]
      },
      { path: "/profile", element: <ProfilePage /> },
      { index: true, element: <HomePage /> },
    ],
  },
]);