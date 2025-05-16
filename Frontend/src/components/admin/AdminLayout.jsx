import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu } from "lucide-react"; // Optional icon lib

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { path: "home", label: "Home" },
    { path: "users", label: "User Management" },
    { path: "listings", label: "Listing Management" },
  ];

  const handleNav = (path) => {
    navigate(path, { replace: true });
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="mt-12 md:mt-0 space-y-4">
          {links.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => handleNav(link.path)}
                className="block w-full text-left px-2 py-2 rounded hover:bg-gray-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Hamburger menu on small screens */}
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded md:hidden bg-white border shadow"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main content */}
      <main className="flex-1 p-2 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
