import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { NextUIProvider, Spinner } from "@nextui-org/react";

import { ThemeProvider } from "@/providers/theme";
import Root from "@/routes/root";
import Patients from "@/routes/patients";
import Fields from "@/routes/fields";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "fields",
        element: <Fields />,
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
