import React from "react";
import "./ManageListings.css";

const ManageListings = () => {
  // Mock data for phone listings
  const mockListings = [
      {
          "title": "Galaxy s III mini SM-G730V Verizon Cell Phone BLUE",
          "brand": "Samsung",
          "image": "imageurl",
          "stock": 9,
          "seller": "5f5237a4c1beb1523fa3db73",
          "price": 56.0,
          "reviews": [
            {
              "reviewer": "5f5237a4c1beb1523fa3db1f",
              "rating": 3,
              "comment": "Got phone yesterday all ... the charger!",
              "hidden": ""
            },
            {
              "reviewer": "5f5237a4c1beb1523fa3db1f",
              "rating": 5,
              "comment": "The charging cable is ... phone was good!"
            }
          ],
          "disabled": ""
        }];
  
  return (
    <div className="manage-listings-container">
      <div className="listings-header">
        <h2>Manage Your Listings</h2>
        <button className="add-listing-button">+ Add New Listing</button>
      </div>

      <div className="listings-grid">
        {mockListings.map((listing) => (
          <div
            key={listing.id}
            className={`listing-card ${!listing.isActive ? "inactive" : ""}`}
          >
            <div className="listing-status">
              <span
                className={`status-badge ${
                  listing.isActive ? "active" : "inactive"
                }`}
              >
                {listing.isActive ? "Active" : "Inactive"}
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
              <button className="toggle-status-button">
                {listing.isActive ? "Disable Listing" : "Enable Listing"}
              </button>
              <button className="delete-button">Delete Listing</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageListings;
