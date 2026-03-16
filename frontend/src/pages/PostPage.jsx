import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const response = await axios.get(`${API_URL}/posts/${id}`, config);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Post not found or unauthorized');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center' }}>Post not found</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unpublished Draft';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Link to="/" className="btn" style={{ marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Progress
      </Link>

      <div className="card">
        <div className="post-header">
          <span className="week-badge">Week {post.week_number} Update</span>
          <h1>{post.title}</h1>
          <div className="post-date">{formatDate(post.published_date)}</div>
        </div>

        <div className="post-content">
          {post.content}
        </div>

        {post.images && post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((img, index) => (
              <img key={index} src={`${SERVER_URL}${img}`} alt={`Update ${index + 1}`} />
            ))}
          </div>
        )}

        {post.links && post.links.length > 0 && (
          <div className="post-links">
            <h3>Important Links</h3>
            <ul>
              {post.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title || link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostPage;
