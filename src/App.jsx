import { RouterProvider } from "react-router";
import { GlobalStyle } from "./GlobalStyle.js";
import { router } from "./app/routes/router.js";

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
