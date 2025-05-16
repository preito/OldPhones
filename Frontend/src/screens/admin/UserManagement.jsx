import React, { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi";

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.fetchUsers(1, 10);
        console.log("Fetched users:", response);
        setData(response.data);
        setMeta(response.meta);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1>User Management Page</h1>
      {data.map(user => (
        <div key={user._id}>
          <p>{user.firstname} {user.lastname} - {user.email}</p>
        </div>
      ))}
    </div>
  );
}
