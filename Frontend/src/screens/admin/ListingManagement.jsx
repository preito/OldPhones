import React, { useEffect, useState } from "react";
import {
  fetchPhones,
  updatePhone,
  deletePhone,
  togglePhoneDisable,
} from "../../api/adminApi";
import { ToastContainer, toast } from "react-toastify";

const ListingManagement = () => {
  const [phones, setPhones] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({});
  const [editPhoneId, setEditPhoneId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [expandedPhoneId, setExpandedPhoneId] = useState(null);

  const loadPhones = async () => {
    try {
      const res = await fetchPhones(page, limit, search, "", maxPrice, "", "");
      setPhones(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to load phones:", err);
      toast.error("Failed to load phone listings.");
    }
  };

  useEffect(() => {
    loadPhones();
  }, [page, search, maxPrice]);

  const handleToggleDisable = async (id) => {
    try {
      await togglePhoneDisable(id);
      setPhones((prev) =>
        prev.map((phone) =>
          phone._id === id ? { ...phone, disabled: !phone.disabled } : phone
        )
      );
      toast.success("Phone status updated.");
    } catch (err) {
      console.error("Error toggling phone:", err);
      toast.error("Failed to toggle phone status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this phone?")) return;
    try {
      await deletePhone(id);
      setPhones((prev) => prev.filter((phone) => phone._id !== id));
      toast.success("Phone deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete phone.");
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditFields((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleEditSave = async (id) => {
    try {
      await updatePhone(id, editFields[id]);
      setEditPhoneId(null);
      setEditFields((prev) => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
      loadPhones();
      toast.success("Phone updated successfully.");
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Failed to save changes.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedPhoneId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <br></br>
      <br></br>
      <h2 className="text-2xl font-bold mb-4">Phone Listings Management</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search title or brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Image</th>
            <th className="p-2">Title</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Avg. Rating</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {phones.map((phone) => (
            <React.Fragment key={phone._id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={`/api/phone/image/name/${encodeURIComponent(phone.brand)}.jpeg`}
                    alt={phone.title}
                    className="h-16"
                  />
                </td>
                <td className="p-2">
                  {editPhoneId === phone._id ? (
                    <input
                      value={editFields[phone._id]?.title || phone.title}
                      onChange={(e) =>
                        handleEditChange(phone._id, "title", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    phone.title
                  )}
                </td>
                <td className="p-2">{phone.brand}</td>
                <td className="p-2">
                  {editPhoneId === phone._id ? (
                    <input
                      type="number"
                      value={editFields[phone._id]?.price || phone.price}
                      onChange={(e) =>
                        handleEditChange(phone._id, "price", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    `$${phone.price}`
                  )}
                </td>
                <td className="p-2">
                  {editPhoneId === phone._id ? (
                    <input
                      type="number"
                      value={editFields[phone._id]?.stock || phone.stock}
                      onChange={(e) =>
                        handleEditChange(phone._id, "stock", e.target.value)
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    phone.stock
                  )}
                </td>
                <td className="p-2">
                  {phone.avgRating ? phone.avgRating.toFixed(1) : "N/A"}
                </td>
                <td className="p-2 flex flex-wrap gap-1">
                  {editPhoneId === phone._id ? (
                    <button
                      onClick={() => handleEditSave(phone._id)}
                      className="px-2 py-1 rounded bg-blue-600 text-white"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditPhoneId(phone._id);
                        setEditFields((prev) => ({
                          ...prev,
                          [phone._id]: {
                            title: phone.title,
                            price: phone.price,
                            stock: phone.stock,
                          },
                        }));
                      }}
                      className="px-2 py-1 rounded bg-gray-700 text-white"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleDisable(phone._id)}
                    className={`px-2 py-1 rounded text-white ${
                      phone.disabled ? "bg-green-600" : "bg-yellow-600"
                    }`}
                  >
                    {phone.disabled ? "Enable" : "Disable"}
                  </button>
                  <button
                    onClick={() => handleDelete(phone._id)}
                    className="px-2 py-1 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleExpand(phone._id)}
                    className="px-2 py-1 rounded bg-indigo-600 text-white"
                  >
                    {expandedPhoneId === phone._id ? "Hide" : "Details"}
                  </button>
                </td>
              </tr>

              {expandedPhoneId === phone._id && (
                <tr>
                  <td colSpan="7" className="bg-gray-50 p-4">
                    <div>
                      <p>
                        <strong>Seller:</strong> {phone.seller?.name || "N/A"} (
                        {phone.seller?.email || "N/A"})
                      </p>
                      <p>
                        <strong>Reviews:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4">
                        {phone.reviews && phone.reviews.length > 0 ? (
                          phone.reviews.map((review, idx) => (
                            <li key={idx}>
                              <strong>{review.user}</strong>: {review.comment} (
                              {review.rating}★)
                            </li>
                          ))
                        ) : (
                          <li>No reviews</li>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {meta.page || 1} of {meta.pages || 1}
        </span>
        <button
          disabled={page >= meta.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingManagement;
