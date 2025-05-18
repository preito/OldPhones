export default function ReviewTable({ reviews, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Reviewer</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Comment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id}>
              <td className="p-2 border">{r.phoneTitle}</td>
              <td className="p-2 border text-sm">{r.reviewer}</td>
              <td className="p-2 border">{r.rating}</td>
              <td className="p-2 border">{r.comment}</td>
              <td className="p-2 border">
                <button onClick={() => onDelete(r._id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
