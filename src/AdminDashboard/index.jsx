import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDonations } from '../../store/donationSlice.js';
import { getFreshness } from '../helperFunctions/getFreshness.js';
import './style.css';
import axios from 'axios';

export default function AdminDashboard() {
  const [filter, setFilter] = useState('all');
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.donations);

  const fetchDonations = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setDonations(res.data.donations));
    } catch (err) {
      console.error('Error fetching admin donations:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [dispatch]);

  const filtered = list.filter((donation) =>
    filter === 'all' ? true : donation.status === filter
  );

  const isStale = (createdAt, status) => {
    const now = new Date();
    const donatedTime = new Date(createdAt);
    const diffHours = (now - donatedTime) / (1000 * 60 * 60);
    return diffHours > 24 && status === 'available';
  };

  // Delete all stale donations
  const handleDeleteStale = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all items older than 24 hours and not claimed? This action cannot be undone.'
    );
    if (!confirmed) return;
    const token = localStorage.getItem('token');
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/deleteStaleDonations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchDonations();
    } catch (err) {
      console.error('Failed to delete stale donations:', err);
    }
  };

  //Delete any donated item
  const handleDeleteAny = async (donationId) => {
    
    const confirmed = window.confirm('Are you sure you want to delete this donation?');
    
    if (!confirmed) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Donation deleted successfully');
      fetchDonations();
    } catch (err) {
      console.error('Failed to delete donation:', err);
    }
  };

  const handleSuspendUser = async (userId, currentStatus) => {
    const token = localStorage.getItem('token');
    const confirmed = window.confirm(
      `Are you sure you want to ${currentStatus ? 'unsuspend' : 'suspend'} this user?`
    );
    if (!confirmed) return;
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/suspend-user/${userId}`,
        { suspend: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`User ${!currentStatus ? 'suspended' : 'unsuspended'} successfully.`);
      fetchDonations();
    } catch (err) {
      console.error('Failed to update suspension status:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title">All Donations</h2>

      <select className="filter-dropdown" onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="claimed">Claimed</option>
        <option value="picked">Picked</option>
        <option value="deleted">Deleted</option>
      </select>

      {filtered.some((donation) => isStale(donation.createdAt, donation.status)) && (
        <div style={{ margin: '1rem 0' }}>
          <button className="stale-all stale-delete-btn" onClick={handleDeleteStale} disabled={loading}>
            Delete All Stale Food Items
          </button>
          <p style={{ marginLeft:'2rem', fontSize: '0.85rem', color: 'gray', textAlign: 'left' }}>
            NOTE: This will only remove food donations older than 24 hours and not claimed.
          </p>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="donation-cards">
          {filtered.map((donation) => (
            <div key={donation._id} className={`donation-card ${donation.status}`}>
              <img
                src={donation?.image}
                alt={donation.foodDetails || 'Donation'}
                className="donation-img"
              />

              <h3 className="donation-title">{donation.foodDetails || 'Unnamed Food Item'}</h3>
              <p><strong>Status:</strong> {donation.status}</p>
              <p><strong>Donor:</strong> {donation.donor?.username}</p>
              <p><strong>Receiver:</strong> {donation.receiver?.username || 'Not claimed yet'}</p>

              <p><strong>Donated At:</strong> {donation.createdAt ?
                `${new Date(donation.createdAt).toLocaleDateString('en-IN')} 
                 ${new Date(donation.createdAt).toLocaleTimeString('en-IN')}` : "N/A"}
              </p>

              <p><strong>Pickup Time:</strong> {donation.availableTime || "N/A"}</p>
              <p><strong>Donor Email:</strong> {donation.donor?.email || "N/A"}</p>
              <p><strong>Receiver Email:</strong> {donation.receiver?.email || "N/A"}</p>

              {donation.status === 'available' && (
                <p><strong>Freshness:</strong> {getFreshness(donation.createdAt)}</p>
              )}

              {/* Delete button for ANY donation */}
              <div className="stale-single">
                <button className="stale-delete-btn" onClick={() => handleDeleteAny(donation._id)}>
                  Delete This Donation
                </button>
              </div>

              {/* Suspend donor */}
              {donation.donor && (
                <p>
                  <button
                    className={`suspend-btn ${donation.donor?.isSuspended ? 'suspended' : ''}`}
                    onClick={() => handleSuspendUser(donation.donor._id, donation.donor.isSuspended)}
                  >
                    {donation.donor.isSuspended ? 'Unsuspend' : 'Suspend'} Donor
                  </button>
                </p>
              )}

              {/* Suspend receiver */}
              {donation.receiver && (
                <p>
                  <button
                    className={`suspend-btn ${donation.receiver?.isSuspended ? 'suspended' : ''}`}
                    onClick={() => handleSuspendUser(donation.receiver._id, donation.receiver.isSuspended)}
                  >
                    {donation.receiver.isSuspended ? 'Unsuspend' : 'Suspend'} Receiver
                  </button>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

