  import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { logout} from '../../store/AuthSlice.js';

  import Navbar from '../Navbar';
  import Home from '../Home';
  import Login from '../Login';
  import Register from '../Register';
  import AllDonations from '../AllDonations';
  import Donate from '../Donate';
  import Profile from '../Profile';
  import DonorDonations from '../DonorDonations';
  import './style.css';
  import AvailableDonations from '../AvailableDonations';
  import DonorReview from '../DonorReview';
  import ReceiverReviews from '../RecieverReview';
  import AdminDashboard from '../AdminDashboard';
  import DonorFAQs from '../FAQs/DonorFAQs.jsx';
  import ReceiverFAQs from '../FAQs/ReceiverFAQs.jsx';
  import ForgotPassword from '../ForgotPassword';
  import ResetPassword from '../ResetPassword';
  import Chatbot from '../Chatbot'; 


  import { useEffect } from 'react';
  import { socket } from '../socket.js';
import AdminFAQs from '../FAQs/AdminFAQs.jsx';

  const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

export default function App() {

  useEffect(() => {
      const token = localStorage.getItem('token');

      if (token && !socket.connected) {
        console.log("🔁 Reconnecting socket after refresh...");
        socket.auth.token = token;
        socket.connect();
      }

  }, []);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token} = useSelector((state) => state.auth);
    const isAuthenticated = !!token;
    const role = localStorage.getItem("role");
  

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      navigate('/login');
    };

    return (
      <div className={isAuthenticated ? 'App' : 'App-no-navbar'}>

        {isAuthenticated && (

          <Navbar className="navbar">
            <ul>
              <li><Link to="/">Home</Link></li>

              {(role === 'receiver' || role === 'donor') && (
                  <li><Link to="/allDonations">All Donations</Link></li>
              )
              }
              
              {
                role === 'donor' && <li><Link to="/donorFAQs">FAQs</Link></li>
              }

              {
                role === 'receiver' && <li><Link to="/receiverFAQs">FAQs</Link></li>
              }  

              {
                role === 'admin' && <li><Link to="/adminFAQs">FAQs</Link></li>
              }           

              <li><Link to="/profile">Profile</Link></li>

              {
                role === 'donor' && (
                    <li><Link to="/recieverReviews">Reviews</Link></li>
                )
              }

              {
                role === 'donor' && (
                  <li><Link to="/donate">Donate</Link></li>
                )
              }

              {
                role === 'admin' && (
                    <li><Link to="/admin/donations">Dashboard</Link></li>
                )
              }

              <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
            
            </ul>
          </Navbar>

        )}

        <Routes>
  
          <Route path="/login" element={<Login />} />

          <Route path="/registerUser" element={<Register />} />

          <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home /></ProtectedRoute>} />
          
          <Route path="/allDonations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AllDonations /></ProtectedRoute>} />
          
          <Route path="/donorFAQs" element={<ProtectedRoute isAuthenticated={isAuthenticated}>< DonorFAQs/></ProtectedRoute>} />

          <Route path="/receiverFAQs" element={<ProtectedRoute isAuthenticated={isAuthenticated}>< ReceiverFAQs/></ProtectedRoute>} />

          <Route path="/adminFAQs" element={<ProtectedRoute isAuthenticated={isAuthenticated}>< AdminFAQs/></ProtectedRoute>} />
          
          <Route path="/donate" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Donate /></ProtectedRoute>} />
          
          <Route path="/myDonations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><DonorDonations /></ProtectedRoute>} />
          
          <Route path="/availableDonations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AvailableDonations /></ProtectedRoute>} />
          
          <Route path="/profile" element={ <ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          
          <Route
            path="/submitReview/:donationId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DonorReview/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recieverReviews"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ReceiverReviews/>
              </ProtectedRoute>
            }
          />

          <Route path="/admin/donations" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>

         {isAuthenticated && <Chatbot />}
         
      </div>
    );
  }
