import { useState, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './styles/Donate.css';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 28.6139, // Default: New Delhi
  lng: 77.2090,
};

const Donate = () => {
  const [foodDetails, setFoodDetails] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [name, setName] = useState('Anonymous');
  const [location, setLocation] = useState(center);
  const [availableTime,setAvailableTime] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDWqYZHby0RusP-hTbfNip_C_6VM7ap34U',
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const onMarkerDragEnd = useCallback((e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  const handleDonate = async (e) => {

    e.preventDefault();

    if (!foodDetails || !quantity || !image) {
      setMessage({ type: 'error', text: 'Please fill in all fields and upload an image.' });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    const formData = new FormData();
    formData.append('foodDetails', foodDetails);
    formData.append('quantity', quantity);
    formData.append('image', image);
    formData.append('name', name);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    formData.append('availableTime', availableTime);

    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL)

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/donate`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({
        type: 'success',
        text: response.data.message || 'Donation recorded successfully!',
      });

      setTimeout(() => setMessage(null), 2000);

      setFoodDetails('');
      setQuantity('');
      setName('');
      setImage(null);
      setAvailableTime('');
      document.querySelector('input[type="file"]').value = '';

    } 
    catch (error) {
      console.error('Donation error:', error.response?.data, error.message);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error during donation.',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Donate Food</h2>
      <form onSubmit={handleDonate}>
        <div className="input-field">
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-field">
          <input type="text" placeholder="Food Details" value={foodDetails} onChange={(e) => setFoodDetails(e.target.value)} />
        </div>

        <div className="input-field">
          <input type="text" placeholder="Quantity (e.g., 5 dozen, 3.5 litres)" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className="input-field">
          <input type="file" name="image" onChange={handleImageChange} />
        </div>

        <div className="map-container">
          <label>Select Donation Location:</label>
          {isLoaded && (
            <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={13}>
              <Marker position={location} draggable={true} onDragEnd={onMarkerDragEnd} />
            </GoogleMap>
          )}
        </div>
         
        <div className="input-field">
          <input type="text" name="availableTime" placeholder='Enter pickup time  e.g., "6 PM - 8 PM"' value={availableTime} onChange={ (e) => setAvailableTime(e.target.value)} />
        </div>

        <button type="submit" className="submit-btn">Donate</button>
        
      </form>

      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Donate;

