import { useNavigate, Outlet } from 'react-router-dom';


export default function AdminLayout() {
  const navigate = useNavigate();

  const links = [
    { path: 'home', label: 'Home' },
    { path: 'users', label: 'User Management' },
    { path: 'listings', label: 'Listing Management' },
  ];
  const handleNav = (path) => {
    navigate(path, { replace: true }); // prevents history stacking
  };
  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-200 p-4">
        <ul>
          {links.map(link => (
            <li key={link.path}>
              <button onClick={() => handleNav(link.path)} className="block mb-2">
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content area */}
      <main className="flex-1 m-0 p-4">
        {/* Outlet renders the nested route component */}
        <Outlet />
      </main>
    </div>
  );
}
