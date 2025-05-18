export default function Pagination({ meta, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Prev
      </button>
      <span>
        Page {meta.page} of {meta.pages}
      </span>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={meta.page >= meta.pages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </button>
    </div>
  );
}
