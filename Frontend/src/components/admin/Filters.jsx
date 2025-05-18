export default function Filters({ filters, onChange }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-4">
      <input
        className="border px-3 py-2 rounded"
        placeholder="Search Title"
        value={filters.title}
        onChange={(e) => onChange({ ...filters, title: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded"
        placeholder="Search Reviewer"
        value={filters.reviewer}
        onChange={(e) => onChange({ ...filters, reviewer: e.target.value })}
      />
      <input
        className="border px-3 py-2 rounded"
        placeholder="Search Comment"
        value={filters.comment}
        onChange={(e) => onChange({ ...filters, comment: e.target.value })}
      />
    </div>
  );
}
