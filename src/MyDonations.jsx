import { useEffect } from 'react';
import axios from 'axios';
import './styles/MyDonations.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDonations,
  setLoading,
  setError,
} from '../store/donationSlice';

const MyDonations = () => {
  const donations = useSelector((state) => state.donations.list);
  const loading = useSelector((state) => state.donations.loading);
  const error = useSelector((state) => state.donations.error);
  const dispatch = useDispatch();

  const token = localStorage.getItem('token');

  const fetchDonations =  ()=>{

      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        dispatch(setDonations(response.data.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        dispatch(setError('Failed to load donations.'));
        dispatch(setLoading(false));
        console.error(error);
      });

    }

  useEffect(() => {
   
    dispatch(setLoading(true));
    fetchDonations();

  }, [dispatch]);

  const handleDelete = async (donationId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this food item?'
    );
    
    if (!confirmed) return;

    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/donations/${donationId}/delete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchDonations();

    } 
    catch (error) {
      console.error('Error deleting donation:', error);
    }
  };

  return (
    <div className="donations-container">
      <h1>All Donations</h1>

      <div className="donations-grid">
        {loading ? (
          <p>Loading donations...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : donations.filter((d) => d.status !== 'deleted').length > 0 ? (
          donations
            .filter((donation) => donation.status !== 'deleted') // hide deleted
            .map((donation) => (
              <div className="donation-card" key={donation._id}>
                <img
                  src={donation?.image}
                  alt={donation.foodDetails || 'Donation'}
                  className="donation-image"
                />
                <h3>{donation?.foodDetails || 'Unknown Food Item'}</h3>
                <p>
                  <strong>Receiver:</strong>{' '}
                  {donation.receiver
                    ? donation.receiver.username
                    : 'Not yet claimed'}
                </p>

                <p><strong>Quantity:</strong> {donation.quantity || 'N/A'}</p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    style={{
                      color:
                        donation.status === 'available'
                          ? 'green'
                          : donation.status === 'claimed'
                          ? 'orange'
                          : 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {donation.status}
                  </span>
                </p>

                {donation.status === 'available' && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(donation._id)}
                  >
                    Delete
                  </button>
                )}


              </div>
            ))
        ) : (
          <p>No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default MyDonations;
