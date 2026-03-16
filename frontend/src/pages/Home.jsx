import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
    <div>
      <section className="hero">
        <h1>Building the Future</h1>
        <p>Follow our 6-week journey of creating something amazing from scratch. Weekly updates, challenges, and wins.</p>
      </section>

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
        <div className="post-grid">
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
