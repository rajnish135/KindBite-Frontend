import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDonations } from '../store/donationSlice.js';
import { getFreshness } from './helperFunctions/getFreshness.js';
import './styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {

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
  const diffMs = now - donatedTime;
  const diffHours = diffMs / (1000 * 60 * 60); 

  return diffHours > 24 && status === 'available';
};


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
      fetchDonations(); // Refresh list after deletion
    } 
    catch (err) {
      console.error('Failed to delete stale donations:', err);
    }
  };

  const handleDeleteSingle = async (donationId) => {
    
    const confirmed = window.confirm('Are you sure you want to delete this stale food item?');
    
    if(!confirmed) 
    return;

    const token = localStorage.getItem('token');

    try{
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/donations/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Food item deleted successfully');
      fetchDonations();
    }
    
    catch(err) {
      console.error('Failed to delete donation:', err);
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


       {
      //filtered.some(...) will return true if at least one donation in the filtered list is stale and available.
         filtered.some((donation) => isStale(donation.createdAt, donation.status)) && (
            
            <div style={{ margin: '1rem 0' }}>

              <button onClick={handleDeleteStale} disabled={loading}>
                🗑️ Delete All Stale Food Items
              </button>

              <p style={{ fontSize: '0.85rem', color: 'gray' }}>
                This will only remove food donations older than 24 hours and not claimed.
              </p>

            </div>
          )
       }


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

              {donation?.location?.coordinates ? (
                <p>
                  <strong>Location:</strong>{' '}
                  <a
                    href={`https://www.google.com/maps?q=${donation.location.coordinates[1]},${donation.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View on Map
                  </a>
                </p>
              ) : (
                <p><strong>Location:</strong> Not available</p>
              )}

            {
            donation.status === 'available' && (
              <p><strong>Freshness:</strong> {getFreshness(donation.createdAt)}</p>
              )
            }

              {isStale(donation.createdAt, donation.status) && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSingle(donation._id)}
                >
                  ❌ Delete This Stale Item
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
