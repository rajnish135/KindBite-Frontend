import { Link } from 'react-router-dom';
import './style.css';
import img1 from '../../public/food-donation.avif';
import img2 from '../../public/distribution.avif';
import img3 from '../../public/img3.avif';

const Home = () => {

  const role = localStorage.getItem("role");

  return (

    <div className="home-container">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Share Food, Spread Kindness</h1>
          <p>Give Your Extra a Purpose – With KindBite</p>
          {
            role === 'donor' && 
            <div className="hero-buttons">
            <Link to="/donate" className="btn">Donate Now</Link>
            </div>
          }
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features">
        <h2>What Makes KindBite the Smart Choice?</h2>
      <div className="feature-cards">
          <div className="hero-content">
            
                <div className="card">
                  <img src={img1} alt="Donate Food" />
                  <h3>Seamless Sharing</h3>
                  <p>Share extra meals with a tap. Fast, simple, and deeply impactful.</p>
                </div>

                <div className="card">
                  <img src={img2} alt="Verified Recipients" />
                  <h3>Trusted Distribution</h3>
                  <p>Every donation reaches someone in real need — safely and reliably.</p>
                </div>

                <div className="card">
                  <img src={img3} alt="Track Donations" />
                  <h3>Drop & Notify</h3>
                  <p>Share your donation spot to notify local receivers instantly.</p>
                </div>
                
            </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 KindBite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
