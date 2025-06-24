import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Profile.css';
import axios from 'axios';

const Profile = ({onLogout }) => {
  const [username, setUsername] = useState('');
  const [foodData, setFoodData] = useState([]);
  const [message, setMessage] = useState(null);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token") || "";

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };
        
        console.log("BEFORE REQUEST")
        //fetch user Profile
        const res1 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/userDetails`, config);

        console.log("Logged in UserDetails: ", res1.data);
        setUsername(res1.data.data.username);

        // console.log("AFTER REQ");

        const res2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, config);
     
        console.log("Fetch Logged in User donated food",res2.data.data);
        setFoodData(res2.data.data)
        
      } 
      catch (err) {
        console.log("Error fetching user details:", err);
        setMessage({ text: 'Failed to load profile information.' });
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    console.log('Profile: Logging out');
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };


  return (
    <div className="profile-container">
      {message ? (
        <div className="error-message">{message.text}</div>
      ) : (
        <>
          <h2>Welcome, {username}!</h2>
          
          {
            role === 'donor' && (
              <div>
                <h3>Your Food Donations</h3>

                  <div className="food-data">
                    {foodData.length > 0 ? (
                      <ul>
                        {foodData.map((item, index) => (
                          <li key={index}>
                            Donated {item.quantity} {item.foodDetails}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No donations yet.</p>
                    )}
                  </div>
              </div>
            )
          }
          

          <div className="profile-actions">
            <button className="action-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
