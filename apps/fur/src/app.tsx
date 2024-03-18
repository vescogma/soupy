import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NextUIProvider, Spinner } from "@nextui-org/react";

import { ThemeProvider } from "@/providers/theme";
import Patients from "@/routes/patients";
import Root from "@/routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "patients",
        element: <Patients />,
      },
    ],
  },
]);

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <RouterProvider router={router} fallbackElement={<Spinner />} />
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default App;