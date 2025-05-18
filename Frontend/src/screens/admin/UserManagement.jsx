import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as adminApi from "../../api/adminApi";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });
  const [editedUsers, setEditedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUserDetails, setActiveUserDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, meta } = await adminApi.fetchUsers(
          currentPage,
          usersPerPage,
          searchTerm,
          sortField,
          sortOrder
        );
        setUsers(data);
        setMeta(meta);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditedUsers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const confirm = window.confirm("Are you sure you want to save changes?");
    if (!confirm) return;

    const edited = editedUsers[id];
    if (!edited) return;

    try {
      await adminApi.updateUser(id, {
        firstname: edited.firstname,
        lastname: edited.lastname,
        email: edited.email,
      });

      toast.success("User updated successfully");

      setUsers((prev) =>
        prev.map((user) => (user._id === id ? { ...user, ...edited } : user))
      );
      setEditedUsers((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await adminApi.deleteUser(id);
      toast.success("User deleted successfully");

      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleToggleDisable = async (userId) => {
    const confirm = window.confirm("Are you sure you want to toggle the user's active status?");
    if (!confirm) return;

    try {
      const result = await adminApi.toggleUserDisable(userId);
      toast.success(result.message);

      const updated = await adminApi.fetchUsers(
        currentPage,
        usersPerPage,
        searchTerm,
        sortField,
        sortOrder
      );
      setUsers(updated.data);
      setMeta(updated.meta);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to change user status");
    }
  };

  const getSortArrow = (field) => {
    return sortField === field ? (sortOrder === "asc" ? " ▲" : " ▼") : "";
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-6 text-center">User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full px-4 py-2 border rounded mb-4 mx-auto block"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th
                  className="px-4 py-2 text-center cursor-pointer"
                  onClick={() => handleSort("firstname")}
                >
                  Full Name{getSortArrow("firstname")}
                </th>
                <th
                  className="px-4 py-2 text-center cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email{getSortArrow("email")}
                </th>
                <th
                  className="px-4 py-2 text-center cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At{getSortArrow("createdAt")}
                </th>
                <th className="px-4 py-2 text-center">Actions</th>
                <th className="px-4 py-2 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const edited = editedUsers[user._id] || {};
                const createdDate = new Date(user.createdAt).toLocaleDateString();
                return (
                  <tr key={user._id} className="border-t text-center">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="First"
                        className="w-fit border rounded px-2 py-1"
                        value={edited.firstname ?? user.firstname}
                        onChange={(e) =>
                          handleEditChange(user._id, "firstname", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last"
                        className="w-fit border rounded px-2 py-1 mt-1"
                        value={edited.lastname ?? user.lastname}
                        onChange={(e) =>
                          handleEditChange(user._id, "lastname", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full border rounded px-2 py-1"
                        value={edited.email ?? user.email}
                        onChange={(e) =>
                          handleEditChange(user._id, "email", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-2">{createdDate}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleSave(user._id)}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleToggleDisable(user._id)}
                          className={`px-3 py-1 rounded font-medium transition ${
                            user.disabled
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                        >
                          {user.disabled ? "Enable" : "Disable"}
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </div>
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
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between max-w-md mx-auto">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="self-center font-medium">
          Page {currentPage} of {meta.pages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === meta.pages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {activeUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">
              Listings & Reviews for {activeUserDetails.firstname} {activeUserDetails.lastname}
            </h2>
            <p>Listings and Reviews placeholder here.</p>
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
