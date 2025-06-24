  import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
  import { useDispatch, useSelector } from 'react-redux';
  import { logout} from '../store/AuthSlice.js';

  import Navbar from './Navbar';
  import Home from './Home';
  import Login from './Login';
  import Register from './Register';
  import AllDonations from './AllDonations';
  import Donate from './Donate';
  import Profile from './Profile';
  import MyDonations from './MyDonations';
  import './styles/App.css';
  import AvailableDonations from './AvailableDonations.jsx';
  import SubmitReview from './SubmitReviews.jsx';
  import ReceiverReviews from './ReceiverReviews.jsx';
  import AdminDashboard from './AdminDashboard.jsx';
  import DonorFAQs from './DonorFAQs.jsx';
import ReceiverFAQs from './ReceiverFAQs.jsx';

  const ProtectedRoute = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  function App() {

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
                role === 'donor' && role !== 'admim' ? (
                    <li><Link to="/donorFAQs">FAQs</Link></li>
                ) : (
                  <li><Link to="/receiverFAQs">FAQs</Link></li>
                )
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
          
          <Route path="/donate" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Donate /></ProtectedRoute>} />
          
          <Route path="/myDonations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyDonations /></ProtectedRoute>} />
          
          <Route path="/availableDonations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AvailableDonations /></ProtectedRoute>} />
          
          <Route path="/profile" element={ <ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          
          <Route
            path="/submitReview/:donationId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SubmitReview/>
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
        </Routes>
      </div>
    );
  }

  export default App;
