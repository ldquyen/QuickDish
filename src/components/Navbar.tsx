"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";

export default function AppNavbar() {

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <p className="font-bold text-inherit text-secondary">App ...</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="hover:text-secondary" color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="hover:text-secondary"
            color="foreground"
            href="/menu"
          >
            Menu
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="hover:text-secondary"
            color="foreground"
            href="/checkout"
          >
            Checkout
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
