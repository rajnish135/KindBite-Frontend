import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { setDonations } from '../store/donationSlice.js';
import './styles/AvailableDonation.css';



const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  marginTop: '20px',
};

const center = {
  lat: 28.6139,
  lng: 77.2090,
};

const AvailableDonations = () => {
  const dispatch = useDispatch();
  const donations = useSelector((state) => state.donations.list); // 🔥 from Redux store
  const [selected, setSelected] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDWqYZHby0RusP-hTbfNip_C_6VM7ap34U' // secure this later
  });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("ALL AVAILABLE FOOD ITEMS", res.data);
        dispatch(setDonations(res.data.data)); 
      } 
      catch (err) {
        console.error('Error fetching donations:', err);
      }

    };

    fetchDonations();

  }, [dispatch]);

  return (

    <div className="donations-container">

      <h2 className="donations-heading">Available Food Donations</h2>

      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {donations.map((donation, index) => (
            <Marker
              key={index}
              position={{
                lat: donation.location.coordinates[1],
                lng: donation.location.coordinates[0],
              }}
              onClick={() => setSelected(donation)}
              animation={2}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{
                lat: selected.location.coordinates[1],
                lng: selected.location.coordinates[0],
              }}
              onCloseClick={() => setSelected(null)}
            >
              <div className="info-window">
                <h4>{selected.name}</h4>
                <p>{selected.foodDetails}</p>
                <p><strong>Quantity:</strong> {selected.quantity}</p>
                {selected.image && (
                  <img src={selected.image} alt="Food" className="food-image" />
                )}
              </div>
            </InfoWindow>
          )}

        </GoogleMap>

      )}

    </div>
  );
};

export default AvailableDonations;
