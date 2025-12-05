import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import { setDonations, setLoading, setError } from '../../store/donationSlice.js';
import { socket } from '../socket.js';
import { getFreshness } from '../helperFunctions/getFreshness.js';

export default function AllDonations() 
{
  const dispatch = useDispatch();

  const allDonations = useSelector(state => state.donations.list);
  const loading = useSelector(state => state.donations.loading);
  const error = useSelector(state => state.donations.error);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {

  socket.on('connect', () => {
    console.log("Connected to socket with ID:", socket.id);
  });

   socket.on('connect_error', (err) => {
    console.error("Socket connection error:", err);
  });


//if current user is donor then go MyDonations.jsx
    if(role === "donor") {
      navigate('/myDonations');
      return;
    }

    const fetchDonations = async () => {

      dispatch(setLoading(true));

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/allDonations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(setDonations(res.data.donations));
        dispatch(setLoading(false));
      } 
      catch (err) {
        console.error("Error fetching donations:", err);
        dispatch(setError("Failed to load donations. Please try again later."));
        dispatch(setLoading(false));
      }
    };

    fetchDonations();

  }, [navigate,dispatch,role,userId]);


  const toggleClaim = async (donationId) => {

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/claim/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
       
      // console.log("DATA FROM DONATION CLAIM",res.data);

      console.log("Donation receiver._id:", res.data.receiver?._id);
console.log("Logged-in userId:", userId);

      alert(res.data.message);
    } 

    catch (err) {
      console.error("Claim error:", err);
      alert(err.response?.data?.message || "Failed to process claim. Try again.");
    }
  };

  const markAsReceived = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/markReceived/${donationId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

    alert(res.data.message);
    
    }
     catch (err) 
     {
      console.error("Mark received error:", err);
      alert(err.response?.data?.message || "Failed to mark as received.");
    }
  };
  

//Filtered out deleted donations only for receivers:
  const visibleDonations = allDonations.filter((donation) => {
  if (role === 'receiver')
  return donation.status !== 'deleted';
  
  return true;
});


  return (
    <div className="donations-container">

      <h1>Donations List</h1>

      <div className="donations-grid">
        {loading ? (
          <p>Loading donations...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : visibleDonations?.length > 0 && (role === 'admin' || role === 'receiver') ? (
          
          visibleDonations.map((donation) => {

            console.log("💾 Donations list from Redux:", visibleDonations);

            return(

            <div className="donation-card" key={donation._id}>

              <img
                src={donation?.image}
                alt={donation.foodDetails || "Donation"}
                className="donation-image"
              />

              <h3>{donation?.foodDetails || "Unknown Food Item"}</h3>
              <p><strong>Donor:</strong> {donation.name || "Anonymous"}</p>
              <p><strong>Quantity:</strong> {donation.quantity || "N/A"}</p>
              <p><strong>Donated At:</strong> {donation.createdAt ? 
              `${new Date(donation.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}, ${new Date(donation.createdAt).toLocaleTimeString('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}` : "N/A"}
             </p>



              <p><strong>Pickup Time:</strong> {donation.availableTime || "N/A"}</p>

              {donation?.location?.coordinates ? (
                <p>
                  <strong>Location:</strong>{" "}
                  <a
                    href={`https://www.google.com/maps?q=${donation.location.coordinates[1]},${donation.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </p>
              ) : (
                <p><strong>Location:</strong> Not available</p>
              )}
              <p>
                <strong>Status:</strong>{" "}
                <span style={{
                  color: donation.status === 'available' ? 'green' :
                         donation.status === 'claimed' ? 'orange' : 'black',
                  fontWeight: 'bold'
                }}>
                  {donation.status}
                </span>
              </p>

            {
            donation.status === 'available' && (
              <p><strong>Freshness:</strong> {getFreshness(donation.expiryAt)}</p>
              )

            }
              
            {
              role === 'receiver' && (
              <div>
              <button
                className={
                  donation.status === 'claimed'
                    ? donation.receiver && donation.receiver._id === userId
                      ? 'claimed-btn'
                      : 'disabled-btn'
                    : 'claim-btn'
                }
                onClick={() => toggleClaim(donation._id)}
                disabled={donation.status === 'claimed' && (!donation.receiver || donation.receiver._id !== userId)}
                >
                {donation.status === 'claimed' ? (
                  donation.receiver && donation.receiver._id === userId
                    ? 'Claimed (Click to Unclaim)'
                    : 'Claimed by Another User'
                ) : (
                  donation.status === 'picked' ? 'Picked up' : 'Claim this food'
                )}
              </button>

                  {donation.status === 'claimed' && donation.receiver && donation.receiver._id === userId && (
                    <button
                      className="mark-received-btn"
                      onClick={() => markAsReceived(donation._id)}
                    >
                      Mark as Received
                    </button>
                  )}

                 {
                    donation.status === 'picked' &&
                    !donation.reviewed && ( 
                     <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <Link to={`/submitReview/${donation._id}`}>
                        <button className="leave-review-btn">📝 Leave a Review</button>
                      </Link>
                    </div>
                    ) 
                  }

                </div>
              )}
            </div>
           )
        } )
        ) : (
          <p>No donations found.</p>
        )}
      </div>

    </div>
  );
};
