import { Nav } from "@/components/nav";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
