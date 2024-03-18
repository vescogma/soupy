import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useState } from "react";
import { matchPath, useLocation } from "react-router-dom";

export function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = Boolean(matchPath("/", location.pathname));
  const isPatients = Boolean(matchPath("/patients", location.pathname));
  const isSettings = Boolean(matchPath("/settings", location.pathname));

  return (
    <Navbar
      onMenuOpenChange={setOpen}
      maxWidth="2xl"
      isBordered
      shouldHideOnScroll
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={open ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold">🦊 FUR</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={isHome}>
          <Link
            href="/"
            color={isHome ? "primary" : "foreground"}
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isPatients}>
          <Link
            href="/patients"
            color={isPatients ? "primary" : "foreground"}
            aria-current={isPatients ? "page" : undefined}
          >
            Patients
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isSettings}>
          <Link
            href="/settings"
            color={isSettings ? "primary" : "foreground"}
            aria-current={isSettings ? "page" : undefined}
          >
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem isActive={isHome}>
          <Link
            href="/"
            color={isHome ? "primary" : "foreground"}
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={isPatients}>
          <Link
            href="/patients"
            color={isPatients ? "primary" : "foreground"}
            aria-current={isPatients ? "page" : undefined}
          >
            Patients
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive={isSettings}>
          <Link
            href="/settings"
            color={isSettings ? "primary" : "foreground"}
            aria-current={isSettings ? "page" : undefined}
          >
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="default"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
