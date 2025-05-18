import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { fetchSalesLogs } from '../../api/adminApi'; // Assumes this exists

const SalesLog = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  const [meta, setMeta] = useState({});

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const { data, meta } = await fetchSalesLogs(filters);
        setLogs(data);
        setMeta(meta);
      } catch (err) {
        console.error('Error fetching sales logs:', err);
        toast.error('Failed to load sales logs');
      }
    };
    loadLogs();
  }, [filters]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-center">Sales Log</h2>

      <div className="overflow-x-auto">
        <table className="w-full mt-4 border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Buyer</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((log) => (
                <tr key={log._id}>
                  <td className="p-2 border text-center">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2 border text-center">{log.buyerName}</td>
                  <td className="p-2 border text-center">
                    <ul className="list-disc list-inside text-left">
                      {log.items.map((item, i) => (
                        <li key={i}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 border text-center">${log.total.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No sales found
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

export default SalesLog;
