import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Globe } from '../components/Globe';

const API_URL = 'http://localhost:5001/api';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Calculate highest week number for tracker
  const maxWeek = posts.length > 0 ? Math.max(...posts.map(p => p.week_number)) : 0;
  const totalWeeks = 6; // Standard hackathon length

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <section className="hero" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', minHeight: '45vh', paddingTop: '20px' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <h1 style={{ fontSize: 'clamp(52px, 6vw, 82px)' }}>From problem statement<br />to prototype.</h1>
          <a href="#posts" className="start-reading-btn" style={{ textDecoration: 'none', display: 'inline-flex', width: 'fit-content' }}>
            Start Reading <span className="btn-icon">✹</span>
          </a>
        </div>
        <div style={{ position: 'absolute', right: '-750px', top: '50%', transform: 'translateY(-50%)', perspective: '1200px', width: '1200px', height: '1200px', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)', transformStyle: 'preserve-3d', width: '100%', height: '100%' }}>
            <Globe />
          </div>
        </div>
      </section>

      <div className="main-content-split" style={{ gridTemplateColumns: '1fr', maxWidth: '600px' }}>
        <div className="about-blog-container" style={{ marginBottom: '10px' }}>
          <h4 className="about-label">ABOUT THE BLOG</h4>
          <p className="about-text">
            This blog documents our team's journey through the hackathon -
            from understanding the problem statement to experimenting with
            ideas and building a working prototype. Instead of just
            presenting the final result, we wanted to capture the process:
            the decisions, the challenges, and the lessons learned along the
            way.
          </p>
        </div>
      </div>

      <div className="tracker">
        {Array.from({ length: totalWeeks }).map((_, i) => {
          const weekNum = i + 1;
          let className = "tracker-step";
          if (weekNum < maxWeek) className += " completed";
          if (weekNum === maxWeek) className += " active";

          return (
            <div key={weekNum} className={className} title={`Week ${weekNum}`}>
              {weekNum}
            </div>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading progress...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          No updates published yet. Check back soon!
        </div>
      ) : (
        <div id="posts" className="post-grid">
          {posts.map(post => (
            <Link to={`/post/${post._id}`} key={post._id} className="card post-card">
              <span className="week-badge">Week {post.week_number}</span>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
