import { redirect } from "next/navigation";

import { getCurrentUser } from "@/modules/auth/data/queries";

import { ChangePasswordClient } from "./change-password-client";

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <ChangePasswordClient email={user.email} />;
}
