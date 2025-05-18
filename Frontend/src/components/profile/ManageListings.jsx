import React, { useState, useEffect } from "react";
import * as phoneApi from "../../api/phoneApi";
import "./ManageListings.css";

const BRANDS = [
  "Samsung",
  "Apple",
  "HTC",
  "Huawei",
  "Nokia",
  "LG",
  "Motorola",
  "Sony",
  "BlackBerry",
];

export default function ManageListings() {

  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;


  const [showAdd, setShowAdd]       = useState(false);
  const [newListing, setNewListing] = useState({
    title: "", brand: "", image: "", price: "", stock: ""
  });
  const [addError, setAddError] = useState("");
  const [adding, setAdding]     = useState(false);

  const loadListings = async () => {
    setLoading(true);
    try {
      const res = await phoneApi.getMyPhones();
      setListings(res.data);
    } catch {
      setError("Could not load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);


  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewListing(prev => ({ ...prev, [name]: value }));
  };

 
  const handleBrandChange = (e) => {
    const brand = e.target.value;
    const image = brand
      ? `/api/phone/image/name/${encodeURIComponent(brand)}.jpeg`
      : "";
    setNewListing(prev => ({ ...prev, brand, image }));
  };


  const handleAdd = async () => {
    setAddError("");
    const { title, brand, image, price, stock } = newListing;
    if (!title || !brand || !image || !price || !stock) {
      setAddError("All fields are required.");
      return;
    }
    setAdding(true);
    try {
      await phoneApi.createPhone({
        title,
        brand,
        image,
        price: Number(price),
        stock: Number(stock),
      });
      await loadListings();
      setNewListing({ title: "", brand: "", image: "", price: "", stock: "" });
      setShowAdd(false);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add listing.");
    } finally {
      setAdding(false);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await phoneApi.deletePhone(id);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch {
      setError("Failed to delete listing.");
    }
  };


  const handleToggle = async (listing) => {
    const newDisabled = !listing.disabled;
    try {
      const { data } = await phoneApi.phoneEnableDisable(listing._id, { disabled: newDisabled });
      setListings(prev =>
        prev.map(l =>
          l._id === listing._id
            ? { ...l, disabled: data.phone.disabled }
            : l
        )
      );
    } catch {
      setError("Could not update listing status.");
    }
  };


  const indexOfLast   = currentPage * itemsPerPage;
  const indexOfFirst  = indexOfLast - itemsPerPage;
  const currentItems  = listings.slice(indexOfFirst, indexOfLast);
  const totalPages    = Math.ceil(listings.length / itemsPerPage);

  if (loading) return <p>Loading your listings…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="manage-listings-container">
     
      <div className="listings-header">
        <h2>Manage Your Listings</h2>
        <button className="add-listing-button" onClick={() => setShowAdd(true)}>
          + Add New Listing
        </button>
      </div>

 
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>New Listing</h3>
            {addError && <p className="error-text">{addError}</p>}

            <div className="modal-input-item">
              <label>Title</label>
              <input
                name="title"
                placeholder="e.g. Galaxy S III mini"
                value={newListing.title}
                onChange={handleNewChange}
                disabled={adding}
              />
            </div>

            <div className="modal-input-item">
              <label>Brand</label>
              <select
                name="brand"
                value={newListing.brand}
                onChange={handleBrandChange}
                disabled={adding}
              >
                <option value="">Select Brand</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="modal-input-item">
              <label>Price</label>
              <div className="input-with-prefix">
                <span className="prefix">$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newListing.price}
                  onChange={handleNewChange}
                  disabled={adding}
                />
              </div>
            </div>

            <div className="modal-input-item">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                placeholder="e.g. 5"
                value={newListing.stock}
                onChange={handleNewChange}
                disabled={adding}
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowAdd(false)} disabled={adding}>
                Cancel
              </button>
              <button
                className="confirm-button"
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? "Adding…" : "Add Listing"}
              </button>
            </div>
          </div>
        </div>
      )}


      {currentItems.length === 0 ? (
        <p>You have no listings yet.</p>
      ) : (
        <div className="listings-grid">
          {currentItems.map(listing => {
            const isActive = !listing.disabled;
            return (
              <div
                key={listing._id}
                className={`listing-card ${isActive ? "" : "inactive"}`}
              >
                <div className="listing-status">
                  <span className={`status-badge ${isActive ? "active" : "inactive"}`}>
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="listing-image">
                  <img src={listing.image} alt={listing.title} />
                </div>

                <div className="listing-content">
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-brand">{listing.brand}</p>
                  <p className="listing-price">${listing.price.toFixed(2)}</p>
                  <p className="listing-stock">Stock: {listing.stock}</p>
                </div>

                <div className="listing-actions">
                  <button
                    className="toggle-status-button"
                    onClick={() => handleToggle(listing)}
                  >
                    {isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
