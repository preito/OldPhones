import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as adminApi from "../../api/adminApi";

const mockUsers = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  firstname: `User${i + 1}`,
  lastname: `Last${i + 1}`,
  email: `user${i + 1}@example.com`,
  lastLogin: new Date(),
}));

const mockListings = [
  { id: "l1", title: "iPhone 11", date: "2023-08-01" },
  { id: "l2", title: "Samsung S20", date: "2023-09-15" },
];

const mockReviews = [
  { id: "r1", text: "Great seller!", rating: 5 },
  { id: "r2", text: "Fast delivery", rating: 4 },
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserDetails, setActiveUserDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // useEffect(() => {
  //   setUsers(mockUsers); // Simulated API fetch
  // }, []);

  useEffect(
    () => {
      const fetchUsers = async () => {
        try {
          const response = await adminApi.fetchUsers(currentPage, usersPerPage);
          console.log("Fetched users:", response);
          setUsers(response.data);
          setMeta(response.meta);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, []);
  const handleEditChange = (id, field, value) => {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const confirm = window.confirm("Are you sure you want to save changes?");
    if (!confirm) return;

    try {
      const edited = editedUsers[id];
      toast.success("User updated successfully");

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...edited } : user))
      );
      setEditedUsers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstname.toLowerCase().includes(term) ||
      user.lastname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full max-w-md px-4 py-2 border rounded mb-4"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // reset to first page on new search
        }}
      />

      <div className="overflow-x-auto">
        <table className="max-w-screen-md table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Full Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Last Login Date</th>
              <th className="px-4 py-2 text-left">Last Login Time</th>
              <th className="px-4 py-2 text-left">Actions</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const edited = editedUsers[user.id] || {};
              const loginDate = new Date(user.lastLogin).toLocaleDateString();
              const loginTime = new Date(user.lastLogin).toLocaleTimeString();

              return (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={edited.firstname ?? user.firstname}
                      onChange={(e) =>
                        handleEditChange(user.id, "firstname", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 mt-1"
                      value={edited.lastname ?? user.lastname}
                      onChange={(e) =>
                        handleEditChange(user.id, "lastname", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="email"
                      className="w-full border rounded px-2 py-1"
                      value={edited.email ?? user.email}
                      onChange={(e) =>
                        handleEditChange(user.id, "email", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-2">{loginDate}</td>
                  <td className="px-4 py-2">{loginTime}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleSave(user.id)}
                    >
                      Save
                    </button>
                    <button className="text-yellow-600 hover:underline">
                      Disable
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setActiveUserDetails(user)}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-between max-w-md mx-auto">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="self-center font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for listings & reviews */}
      {activeUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">
              Listings & Reviews for {activeUserDetails.firstname}{" "}
              {activeUserDetails.lastname}
            </h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Listings:</h3>
              <ul className="list-disc list-inside space-y-1">
                {mockListings.map((listing) => (
                  <li key={listing.id}>
                    {listing.title} — {listing.date}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Reviews:</h3>
              <ul className="list-disc list-inside space-y-1">
                {mockReviews.map((review) => (
                  <li key={review.id}>
                    "{review.text}" — {review.rating}⭐
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setActiveUserDetails(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
