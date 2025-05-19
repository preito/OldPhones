import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Removed import of fetchPhones from adminApi
import * as adminApi from "../../api/adminApi";

export default function ListingManagement() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editedListings, setEditedListings] = useState({});
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchListings();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, sortField, sortOrder]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/phonelisting.json"); // Adjust path if needed
      const data = await response.json();

      let phones = Array.isArray(data) ? data : [];

      // Filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        phones = phones.filter(
          (phone) =>
            phone.title.toLowerCase().includes(term) ||
            phone.brand.toLowerCase().includes(term)
        );
      }

      // Sort
      if (sortField && sortField !== "createdAt") {
        phones.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          if (typeof aValue === "string") {
            return sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        });
      }

      const total = phones.length;
      const itemsPerPage = 10;
      const pagedPhones = phones.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );

      setListings(pagedPhones);
      setTotalPages(Math.ceil(total / itemsPerPage));
    } catch (err) {
      console.error("Error fetching listings from JSON", err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditedListings((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (id) => {
    const confirm = window.confirm("Save changes to this listing?");
    if (!confirm) return;

    try {
      const changes = editedListings[id];
      await adminApi.updatePhone(id, changes);
      toast.success("Listing updated!");
      await fetchListings();
      setEditedListings((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch {
      toast.error("Failed to update listing.");
    }
  };

  const handleDisable = async (id) => {
    const confirm = window.confirm("Toggle active status?");
    if (!confirm) return;

    try {
      await adminApi.togglePhoneDisable(id);
      toast.success("Listing status updated");
      await fetchListings();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this listing?");
    if (!confirm) return;

    try {
      await adminApi.deletePhone(id);
      toast.success("Listing deleted");
      await fetchListings();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4">
      <br></br>
      <br></br>
      <h1 className="text-2xl font-bold text-center mb-4">Listing Management</h1>

      <input
        type="text"
        placeholder="Search by title or brand"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded block mx-auto"
      />

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => handleSortChange("price")} className="px-3 py-1 border rounded">
          Sort by Price ({sortField === "price" ? sortOrder : ""})
        </button>
        <button onClick={() => handleSortChange("brand")} className="px-3 py-1 border rounded">
          Sort by Brand ({sortField === "brand" ? sortOrder : ""})
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading listings...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(listings) && listings.map((listing, index) => {
                const id = listing._id || `json-${index}`;
                const edited = editedListings[id] || {};
                return (
                  <tr key={id} className="border-t text-center">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={edited.title ?? listing.title}
                        onChange={(e) =>
                          handleEditChange(id, "title", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">{listing.brand}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={edited.price ?? listing.price}
                        onChange={(e) =>
                          handleEditChange(id, "price", e.target.value)
                        }
                        min={0}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={edited.stock ?? listing.stock}
                        onChange={(e) =>
                          handleEditChange(id, "stock", e.target.value)
                        }
                        min={0}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {listing.disabled ? "Disabled" : "Active"}
                    </td>
                    <td className="px-4 py-2 space-y-1">
                      <button
                        onClick={() => handleSave(id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 block w-full"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDisable(id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 block w-full"
                      >
                        {listing.disabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 block w-full"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
