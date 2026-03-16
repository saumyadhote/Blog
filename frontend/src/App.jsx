import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="container">
      <Link to="/" className="nav-brand">
        Hack<span>Progress</span>
      </Link>
      <div>
        {token ? (
          <>
            <Link to="/admin" className="btn" style={{ marginRight: '10px' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn">Admin Login</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container" style={{ flexGrow: 1, paddingBottom: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
