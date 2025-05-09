import React from "react";
import "./ViewComments.css";

const ViewComments = () => {
  // Mock data for phone listings with reviews
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
          "hidden": "",
        }],
        "disabled": ""
      },
    {
      id: 2,
      title: "iPhone 12 Pro Max",
      brand: "Apple",
      image: "https://example.com/phone2.jpg",
      reviews: [
        {
          reviewer: "5f5237a4cfa3db1f",
          rating: 4,
          comment: "Great phone, works perfectly!",
          hidden: false,
        },
      ],
    },
  ];

  return (
    <div className="view-comments-container">
      <h2>Your Listings' Reviews</h2>

      {mockListings.map((listing) => (
        <div key={listing.id} className="listing-reviews">
          <div className="listing-header">
            <img
              src={listing.image}
              alt={listing.title}
              className="listing-image"
            />
            <div className="listing-info">
              <h3 className="phone-name">{listing.title}</h3>
              <p className="phone-brand">{listing.brand}</p>
            </div>
          </div>

          <div className="reviews-list">
            {listing.reviews.map((review, index) => (
              <div
                key={index}
                className={`review-card ${review.hidden ? "hidden" : ""}`}
              >
                <div className="review-header">
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < review.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="reviewer-id">
                    User ID: {review.reviewer}
                  </span>
                </div>
                <p className="review-text">{review.comment}</p>
                <div className="review-actions">
                  <button className="visibility-toggle">
                    {review.hidden ? "Show Review" : "Hide Review"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewComments;
