import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const SERVER_URL = 'http://localhost:5000';

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [weekNumber, setWeekNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/posts/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      console.error('Error fetching posts:', error);
    }
  };

  const handleSelectPost = (post) => {
    setActivePost(post);
    setIsEditing(true);
    setWeekNumber(post.week_number);
    setTitle(post.title);
    setContent(post.content);
    setPublished(post.published);
    setLinks(post.links.length > 0 ? post.links : [{ title: '', url: '' }]);
    setExistingImages(post.images || []);
    setImages([]);
  };

  const handleNewPost = () => {
    setActivePost(null);
    setIsEditing(true);
    setWeekNumber(posts.length > 0 ? Math.max(...posts.map(p => p.week_number)) + 1 : 1);
    setTitle('');
    setContent('');
    setPublished(false);
    setLinks([{ title: '', url: '' }]);
    setExistingImages([]);
    setImages([]);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const removeLinkField = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    if (newLinks.length === 0) newLinks.push({ title: '', url: '' });
    setLinks(newLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Filter out empty links
    const validLinks = links.filter(link => link.title.trim() !== '' || link.url.trim() !== '');

    const formData = new FormData();
    formData.append('week_number', weekNumber);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('published', published);
    formData.append('links', JSON.stringify(validLinks));

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      if (activePost) {
        // Edit existing
        formData.append('existing_images', JSON.stringify(existingImages));
        Array.from(images).forEach(file => {
          formData.append('new_images', file);
        });
        await axios.put(`${API_URL}/posts/${activePost._id}`, formData, config);
      } else {
        // Create new
        Array.from(images).forEach(file => {
          formData.append('images', file);
        });
        await axios.post(`${API_URL}/posts`, formData, config);
      }
      
      // Cleanup and refresh
      setIsEditing(false);
      fetchPosts();
      
      // Reset file input
      const fileInput = document.getElementById('imageUpload');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post: ' + (error.response?.data?.error || error.message));
    }
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={handleNewPost}>
          + New Weekly Update
        </button>
      </div>

      <div className="admin-grid">
        {/* Left Col - Post List */}
        <div className="card" style={{ padding: 0, alignSelf: 'start' }}>
          <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0 }}>All Posts</h3>
          </div>
          <div>
            {posts.map(post => (
              <div 
                key={post._id} 
                className={`post-list-item ${activePost?._id === post._id ? 'active' : ''}`}
                onClick={() => handleSelectPost(post)}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>Week {post.week_number}: {post.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`status-badge ${post.published ? 'status-published' : 'status-draft'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
            {posts.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No posts yet. Create one!
              </div>
            )}
          </div>
        </div>

        {/* Right Col - Editor */}
        {isEditing ? (
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>
              {activePost ? `Edit Week ${activePost.week_number}` : 'Create New Update'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Week Number</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={weekNumber} 
                    onChange={e => setWeekNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Content (Markdown support can be added later, use plain text for now)</label>
                <textarea 
                  rows="10" 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Images</label>
                {existingImages.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.85rem', marginBottom: '5px' }}>Existing Images:</div>
                    <div className="image-preview">
                      {existingImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img src={`${SERVER_URL}${img}`} alt={`Preview ${idx}`} />
                          <button 
                            type="button" 
                            className="btn btn-danger"
                            style={{ position: 'absolute', top: 5, right: 5, padding: '2px 5px', fontSize: '0.7rem', backgroundColor: 'rgba(0,0,0,0.5)' }}
                            onClick={() => removeExistingImage(idx)}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  id="imageUpload"
                  multiple 
                  accept="image/*"
                  onChange={e => setImages(e.target.files)}
                />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Selected new files: {images.length}
                </div>
              </div>

              <div className="form-group">
                <label>Links (Github, Demo, etc.)</label>
                {links.map((link, index) => (
                  <div key={index} className="link-input-group">
                    <input 
                      type="text" 
                      placeholder="Title (e.g., GitHub Repo)" 
                      value={link.title}
                      onChange={e => handleLinkChange(index, 'title', e.target.value)}
                    />
                    <input 
                      type="url" 
                      placeholder="URL (https://...)" 
                      value={link.url}
                      onChange={e => handleLinkChange(index, 'url', e.target.value)}
                    />
                    <button type="button" className="btn" onClick={() => removeLinkField(index)}>X</button>
                  </div>
                ))}
                <button type="button" className="btn" onClick={addLinkField}>+ Add Link</button>
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                  />
                  <span>Publish Update (visible to public)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Post</button>
                <button type="button" className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', color: 'var(--text-secondary)' }}>
            Select a post from the list or create a new one
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
