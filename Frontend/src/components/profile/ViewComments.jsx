import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as phoneApi from "../../api/phoneApi";
import "./ViewComments.css";

export default function ViewComments() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    phoneApi
      .getMyPhones()
      .then((res) => setListings(res.data))
      .catch((err) => {
        console.error("Failed to load comments:", err);
        setError("Could not load your comments.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggle = (phoneId, review) => {
    phoneApi
      .toggleReviewHidden(phoneId, review._id, !review.hidden)
      .then((res) => {
        setListings((prev) =>
          prev.map((phone) =>
            phone._id === phoneId
              ? {
                  ...phone,
                  reviews: phone.reviews.map((r) =>
                    r._id === review._id ? res.data.review : r
                  ),
                }
              : phone
          )
        );
      })
      .catch((err) => console.error("Could not toggle comment:", err));
  };

  if (!user) return <p>Please sign in to view your comments.</p>;
  if (loading) return <p>Loading comments…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="view-comments-container">
      <h2>Your Listings’ Reviews</h2>
      {listings.map((phone) => (
        <div key={phone._id} className="listing-reviews">
          <div className="listing-header">
            <img
              src={phone.image}
              alt={phone.title}
              className="listing-image"
            />
            <div className="listing-info">
              <h3 className="phone-name">{phone.title}</h3>
              <p className="phone-brand">{phone.brand}</p>
            </div>
          </div>
          <div className="reviews-list">
            {phone.reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              phone.reviews.map((rev) => (
                <div
                  key={rev._id}
                  className={`review-card ${rev.hidden ? "hidden" : ""}`}
                >
                  <div className="review-header">
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < rev.rating ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="reviewer-name">
                      {rev.reviewer.firstname} {rev.reviewer.lastname}
                    </span>
                  </div>
                  <p className="review-text">{rev.comment}</p>
                  <div className="review-actions">
                    <button
                      className="visibility-toggle"
                      onClick={() => handleToggle(phone._id, rev)}
                    >
                      {rev.hidden ? "Show Review" : "Hide Review"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
