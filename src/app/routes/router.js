import { createBrowserRouter } from "react-router";
import SignIn from "../../pages/signin/SignIn";
import SignUp1 from "../../pages/signup/SignUp1";
import SignUp2 from "../../pages/signup/SignUp2";

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
]);
