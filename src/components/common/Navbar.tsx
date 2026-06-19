import { getCurrentUser } from "@/modules/auth/data/queries";

import { NavbarClient, type NavbarUser } from "./navbar-client";

export async function Navbar() {
  const currentUser = await getCurrentUser();
  const navbarUser: NavbarUser | null = currentUser
    ? {
        email: currentUser.email,
        name: currentUser.name,
        isAdmin: currentUser.role === "admin",
      }
    : null;

  return <NavbarClient currentUser={navbarUser} />;
}
