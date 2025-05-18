import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";
import { toast } from "react-toastify";

export default function ListingManagement() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeListing, setActiveListing] = useState(null);
  const [editedListings, setEditedListings] = useState({});

  useEffect(() => {
    fetchListings();
  }, [searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.fetchListings(searchTerm); // implement in your backend
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings", err);
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
      await adminApi.updateListing(id, changes);
      toast.success("Listing updated!");
      fetchListings();
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
      await adminApi.toggleListingDisable(id);
      toast.success("Listing status updated");
      fetchListings();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this listing?");
    if (!confirm) return;

    try {
      await adminApi.deleteListing(id);
      toast.success("Listing deleted");
      fetchListings();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Listing Management</h1>

      <input
        type="text"
        placeholder="Search by title or brand"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full max-w-md px-4 py-2 border rounded block mx-auto"
      />

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
                <th className="px-4 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => {
                const edited = editedListings[listing._id] || {};
                return (
                  <tr key={listing._id} className="border-t text-center">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={edited.title ?? listing.title}
                        onChange={(e) =>
                          handleEditChange(listing._id, "title", e.target.value)
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
                          handleEditChange(listing._id, "price", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={edited.stock ?? listing.stock}
                        onChange={(e) =>
                          handleEditChange(listing._id, "stock", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {listing.disabled ? "Disabled" : "Active"}
                    </td>
                    <td className="px-4 py-2 space-y-1">
                      <button
                        onClick={() => handleSave(listing._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleDisable(listing._id)}
                        className={`${
                          listing.disabled
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-white px-3 py-1 rounded ml-2`}
                      >
                        {listing.disabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="text-red-600 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setActiveListing(listing)}
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

      {/* Modal for Details */}
      {activeListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">Listing Details</h2>
            <p><strong>Title:</strong> {activeListing.title}</p>
            <p><strong>Brand:</strong> {activeListing.brand}</p>
            <p><strong>Seller:</strong> {activeListing.seller?.firstname} {activeListing.seller?.lastname}</p>
            <p className="mt-2 font-semibold">Reviews:</p>
            <ul className="list-disc list-inside">
              {activeListing.reviews?.length > 0 ? (
                activeListing.reviews.map((rev, i) => (
                  <li key={i}>{rev.comment} - ⭐ {rev.rating}</li>
                ))
              ) : (
                <li>No reviews yet.</li>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setActiveListing(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
