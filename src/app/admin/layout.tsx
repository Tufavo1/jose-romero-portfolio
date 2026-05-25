import { ReactNode } from "react";
import { AdminSidebar } from "./sidebar";

export const metadata = { title: "Admin — Portfolio" };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
