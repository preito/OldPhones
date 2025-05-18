// Sidebar.jsx
export default function Sidebar({ onSelect }) {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <button onClick={() => onSelect('sales')} className="block mb-2 w-full text-left">
        Sales Log
      </button>
      <button onClick={() => onSelect('user')} className="block mb-2 w-full text-left">
        User Management
      </button>
      <button onClick={() => onSelect('listing')} className="block w-full text-left">
        Listing Management
      </button>
      <button onClick={() => onSelect('content')} className="block w-full text-left">
        Content Moderation
      </button>
    </div>
  );
}
