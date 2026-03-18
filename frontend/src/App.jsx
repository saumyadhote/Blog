import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { DotPattern } from './components/DotPattern';
import appLogo from './assets/logos/logo.svg';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="top-nav">
      <div className="nav-logo-group">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src={appLogo} alt="Quick Logo" style={{ height: '72px', objectFit: 'contain', border: 'none', outline: 'none' }} />
        </Link>
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/admin" className="nav-link">
              <span className="nav-link-icon">☀️</span> DASHBOARD
            </Link>
            <button onClick={handleLogout} className="nav-link logout-btn">
              <span className="nav-link-icon">☀️</span> LOGOUT
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
             <span className="nav-link-icon">☀️</span> ADMIN LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <>
      <DotPattern width={30} height={30} cx={2} cy={2} cr={2} />
      <Router>
        <Navigation />
        <div style={{ flexGrow: 1, paddingBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
