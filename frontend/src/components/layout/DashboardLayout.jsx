import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="theme-page overflow-x-hidden">

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-h-screen p-8">

        <Navbar onMenuClick={() => setSidebarOpen((current) => !current)} />

        {children}

      </main>

    </div>
  );
}