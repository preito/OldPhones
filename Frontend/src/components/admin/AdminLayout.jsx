import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Menu, LogOut, Bell, BellRing } from "lucide-react"; // Added icons
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  checkUnread
} from '../../api/adminApi';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  if (!user?.sadmin === true) {
    return <Navigate to="/signin" replace />;
  }

  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true); // assume true for demo

  const links = [
    { path: "sales", label: "Sales Log" },
    { path: "users", label: "User Management" },
    { path: "listings", label: "Listing Management" },
    { path: "content", label: "Content Moderation" },
  ];

  const handleNav = (path) => {
    navigate(path, { replace: true });
    setIsSidebarOpen(false);
  };

  const signOut = () => {
    logout();
  };

  const handleNotificationClick = () => {
    navigate("sales", { replace: true });
    setHasNotification(false); // optional reset
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    const checkNotification = async () => {
      try {
        const data = await checkUnread();
        setHasNotification(data.hasUnread);
      } catch (err) {
        console.error("Error checking unread transactions:", err);
      }
    };

    checkNotification();
  }, []);

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
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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

      {/* Notification + Logout buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={handleNotificationClick}
          className="p-2 rounded bg-white border shadow hover:bg-gray-100"
        >
          {hasNotification ? (
            <BellRing className="text-red-500" />
          ) : (
            <Bell className="text-gray-600" />
          )}
        </button>

        <button
          onClick={signOut}
          className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <LogOut className="w-4 h-8" />
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 p-2 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
