import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchModeratedReviews,
  toggleReviewHidden,
  // deletePhone,
} from '../../api/adminApi';

const ContentModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    searchTitle: '',
    searchReviewer: '',
    searchComment: '',
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const { data, meta } = await fetchModeratedReviews(filters);
        setReviews(data);
        setMeta(meta);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        toast.error('Error fetching reviews');
      }
    };
    load();
  }, [filters]);

  const handleToggleReviewHidden = async (phoneId, reviewIndex) => {
    const confirm = window.confirm('Toggle visibility of this review?');
    if (!confirm) return;

    try {
      const res = await toggleReviewHidden(phoneId, reviewIndex);
      toast.success(res.message);
      setFilters({ ...filters }); // Refresh data
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle review visibility');
    }
  };

  const handleDeletePhone = async (phoneId) => {
    const confirm = window.confirm('Are you sure you want to permanently delete this phone and all associated reviews?');
    if (!confirm) return;

    try {
      const res = await deletePhone(phoneId);
      toast.success(res.message || 'Phone deleted successfully');
      setFilters({ ...filters }); // reload updated list
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete phone');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-center">Review Moderation</h2>

      <div className="w-full flex flex-col sm:flex-row gap-2">
        <input
          className="border p-2 rounded w-full sm:w-1/3"
          placeholder="Search by Title"
          value={filters.searchTitle}
          onChange={(e) => setFilters({ ...filters, searchTitle: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-1/3"
          placeholder="Search by Reviewer Name"
          value={filters.searchReviewer}
          onChange={(e) => setFilters({ ...filters, searchReviewer: e.target.value })}
        />
        <input
          className="border p-2 rounded w-full sm:w-1/3"
          placeholder="Search by Comment"
          value={filters.searchComment}
          onChange={(e) => setFilters({ ...filters, searchComment: e.target.value })}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full mt-4 border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Phone Title</th>
              <th className="p-2 border">Reviewer Name</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Comment</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length ? (
              reviews.map((r) => (
                <tr key={r._id} className={r.phoneDisabled ? 'bg-gray-100 text-gray-400' : ''}>
                  <td className="p-2 border text-center">{r.phoneTitle}</td>
                  <td className="p-2 border text-center">{r.reviewerName}</td>
                  <td className="p-2 border text-center">{r.rating}</td>
                  <td className="p-2 border text-center">{r.comment}</td>
                  <td className="p-2 border text-center space-y-1 flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-2">
                    <button
                      onClick={() => handleToggleReviewHidden(r.phoneId, r.reviewer)}
                      className={`text-white px-2 py-1 rounded ${r.hidden ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                        }`}
                    >
                      {r.hidden ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      onClick={() => handleDeletePhone(r.phoneId)}
                      className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <p>
          Page {meta.page} of {meta.pages}
        </p>
        <div className="space-x-2">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={filters.page === meta.pages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
