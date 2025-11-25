import { RouterProvider } from "react-router";
import { GlobalStyle } from "./GlobalStyle.js";
import { router } from "./app/routes/router.jsx";

function App() {
  return (
    <>
      <GlobalStyle />
      <RouterProvider router={router} />
    </>
  );
}

export default App;

// 님들은 석기당하지 마세요
