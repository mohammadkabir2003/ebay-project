import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [role, setRole] = useState(null); // State to hold the user's role
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch session data
    fetch('http://localhost:3001/session', { credentials: 'include' }) // Include credentials for session cookies
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch session data'); // Handle non-200 responses
        }
        return res.json();
      })
      .then((data) => {
        console.log('User role:', data.user.role);
        setRole(data.user.role); // Update state with the fetched role
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
        setRole(null); // Ensure role is null if session fetch fails
      })
      .finally(() => {
        setLoading(false); // Mark loading as complete
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role !== 'admin') {
      navigate('/'); // Redirect non-admins to the homepage
    }
  }, [role, loading, navigate]);


  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending users on component mount
  useEffect(() => {
    fetch('http://localhost:3001/admin/pending-users', {
      credentials: 'include'  // Add this to include session cookies
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch pending users');
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array
        const users = Array.isArray(data) ? data : [];
        setPendingUsers(users);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setPendingUsers([]); // Set to empty array on error
      });
  }, []);

  const updateStatus = (userId, status) => {
    fetch('http://localhost:3001/admin/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status }),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => {
        // Remove user from pending list after updating status
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      })
      .catch((err) => console.error('Error updating status:', err));
  };
  
  const [leavingUsers, setLeavingUsers] = useState([]);
   // Fetch leaving users on component mount
   useEffect(() => {
    fetch('http://localhost:3001/admin/leaving-users', {
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch leaving users');
        }
        return res.json();
      })
      .then((data) => {
        const users = Array.isArray(data) ? data : [];
        setLeavingUsers(users);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setLeavingUsers([]); // Set to empty array on error
      });
  }, []);

  const leaveSystem = (userId) => {
    fetch('http://localhost:3001/admin/opt-out', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId}),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(() => {
        // Remove user from opt-out list after leaving system
        setLeavingUsers((prev) => prev.filter((user) => user.id !== userId));
      })
      .catch((err) => console.error('Error leaving system:', err));
  };

  if (loading) {
    // Show a loading message while session is being fetched
    return <p>Loading...</p>;
  }

  if (role === 'admin') {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl w-full space-y-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>

        {/* Pending Users Table */}
        <h2 className="text-2xl font-bold text-center mb-6">User Registration Approval</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Username</th>
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id} className="bg-gray-50">
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.username}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={() => updateStatus(user.id, 'approved')}
                      className="bg-green-600 text-white px-4 py-1 rounded-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(user.id, 'rejected')}
                      className="bg-red-600 text-white px-4 py-1 rounded-md"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {pendingUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-300 p-2 text-center text-gray-500"
                  >
                    No pending users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Leaving Users Table */}
        <h2 className="text-2xl font-bold text-center mb-6">User Opt-Out Approval</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Name</th>
                <th className="border border-gray-300 p-2 text-left">Username</th>
                <th className="border border-gray-300 p-2 text-left">Email</th>
                <th className="border border-gray-300 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leavingUsers.map((user) => (
                <tr key={user.id} className="bg-gray-50">
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.username}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    <button
                      onClick={() => leaveSystem(user.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded-md"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
              {leavingUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-300 p-2 text-center text-gray-500"
                  >
                    No leaving users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
        <Link to="/">
          <button>
            Back to Home
          </button>
        </Link>
        </div>
      </div>
    </div>
  );}

  
};

export default AdminDashboard;
