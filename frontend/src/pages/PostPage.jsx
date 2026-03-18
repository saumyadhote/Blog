import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';
const SERVER_URL = 'http://localhost:5001';

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

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

  useEffect(() => {
    if (!loading && post) {
      const timer = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [loading, post]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'var(--error)' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center' }}>Post not found</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unpublished Draft';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
        <Link to="/" className="btn" style={{ marginBottom: '40px', display: 'inline-block', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '13px', padding: '8px 16px', borderRadius: '40px' }}>
          &larr; Back to Progress
        </Link>

        {/* Timeline element */}
        <div style={{ marginBottom: '40px', paddingLeft: '24px', borderLeft: '2px solid rgba(155,94,255,0.3)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9B5EFF' }} />
          <div style={{ marginBottom: '16px' }}>
            <span style={{ background: 'rgba(155,94,255,0.15)', color: '#9B5EFF', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', fontWeight: 600 }}>
              Week {post.week_number} Update
            </span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: '#fff', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {formatDate(post.published_date)}
          </div>
        </div>

        {/* Terminal box */}
        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
          backgroundColor: '#1c1c28',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(155,94,255,0.2)',
          boxShadow: '0 0 80px rgba(155,94,255,0.1), 0 30px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Title bar */}
          <div style={{ backgroundColor: '#9B5EFF', padding: '13px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28c840' }} />
            <div style={{ flex: 1, textAlign: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: '#1a0a2e', fontWeight: 600, marginRight: '52px' }}>
              ~/posts/{id}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '36px 40px', backgroundColor: '#15151f', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', lineHeight: '1.9', color: '#b0a0c8' }}>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'inherit', margin: 0 }}>
              {post.content}
              <span className="blinking-cursor" />
            </pre>

            {post.images && post.images.length > 0 && (
              <div style={{ marginTop: '32px', width: '100%' }}>
                {post.images.map((img, index) => (
                  <img key={index} src={`${SERVER_URL}${img}`} alt={`Update ${index + 1}`} style={{ borderRadius: '8px', border: '1px solid rgba(155,94,255,0.2)', width: '100%', marginBottom: '16px' }} />
                ))}
              </div>
            )}

            {post.links && post.links.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <div style={{ color: '#9B5EFF', marginBottom: '12px' }}>$ ls ./links</div>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {post.links.map((link, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      <span style={{ color: '#47bfff', marginRight: '8px' }}>➜</span>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#47bfff', textDecoration: 'none' }}>
                        {link.title || link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
