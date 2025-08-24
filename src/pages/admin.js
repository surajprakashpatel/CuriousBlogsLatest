import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Import Firebase, context, and the new layout
import { db, storage } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
  // --- All of your existing component state and logic remain unchanged ---
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', category: 'all', search: '' });
  const [uploading, setUploading] = useState(false);

  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; 
    if (!currentUser) {
      router.push('/login'); 
    }
  }, [currentUser, authLoading, router]);


  // Fetch blogs from Firestore
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogsCollection = collection(db, 'blogs');
      const q = query(blogsCollection, orderBy('createdAt', 'desc'));
      const blogSnapshot = await getDocs(q);
      const blogList = blogSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogList);
      setFilteredBlogs(blogList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...blogs];

    if (filters.status !== 'all') {
      filtered = filtered.filter(blog => blog.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(blog => blog.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        blog.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredBlogs(filtered);
  };

  // Update blog status
  const updateBlogStatus = async (blogId, newStatus) => {
    try {
      const blogRef = doc(db, 'blogs', blogId);
      const updateData = {
        status: newStatus,
        published: newStatus === 'published',
        publishedAt: newStatus === 'published' ? new Date() : null,
        updatedAt: new Date()
      };
      
      await updateDoc(blogRef, updateData);
      
      setBlogs(blogs.map(blog =>
        blog.id === blogId ? { ...blog, ...updateData } : blog
      ));
      
      alert(`Blog ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating blog status:', error);
      alert('Error updating blog status');
    }
  };

  // Save blog changes
  const saveBlogChanges = async (blogData) => {
    try {
      const blogRef = doc(db, 'blogs', selectedBlog.id);
      const updateData = {
        ...blogData,
        updatedAt: new Date()
      };
      
      await updateDoc(blogRef, updateData);
      
      setBlogs(blogs.map(blog =>
        blog.id === selectedBlog.id ? { ...blog, ...updateData } : blog
      ));
      
      setSelectedBlog({ ...selectedBlog, ...updateData });
      setEditMode(false);
      alert('Blog updated successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog');
    }
  };

  // Upload new thumbnail
  const uploadThumbnail = async (file) => {
    if (!file || !selectedBlog) return;

    setUploading(true);
    try {
      // Delete old thumbnail if exists
      if (selectedBlog.thumbnailUrl) {
        try {
          const oldImageRef = ref(storage, `blog-thumbnails/${selectedBlog.slug}`);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('Old image not found or already deleted');
        }
      }

      // Upload new thumbnail
      const fileName = `blog-thumbnails/${selectedBlog.slug}-${Date.now()}.webp`;
      const imageRef = ref(storage, fileName);
      
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update blog with new thumbnail URL
      const blogRef = doc(db, 'blogs', selectedBlog.id);
      await updateDoc(blogRef, { 
        thumbnailUrl: downloadURL,
        updatedAt: new Date()
      });
      
      setSelectedBlog({ ...selectedBlog, thumbnailUrl: downloadURL });
      setBlogs(blogs.map(blog =>
        blog.id === selectedBlog.id ? { ...blog, thumbnailUrl: downloadURL } : blog
      ));
      
      alert('Thumbnail updated successfully!');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Error uploading thumbnail');
    } finally {
      setUploading(false);
    }
  };

  // Delete blog
  const deleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'blogs', blogId));
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setSelectedBlog(null);
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog');
    }
  };

  // Get unique categories
  const getCategories = () => {
    const categories = [...new Set(blogs.map(blog => blog.category))];
    return categories.filter(category => category);
  };


  useEffect(() => {
    // Only fetch blogs if a user is logged in
    if (currentUser) {
      fetchBlogs();
    }
  }, [currentUser]); 

  useEffect(() => {
    applyFilters();
  }, [filters, blogs]);


  if (authLoading || !currentUser) {
    return (
      <>
        <Head><title>Loading Admin...</title></Head>
        <div className="loading-state">Authenticating...</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Curious Blogs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

        <div className="admin-panel">
      <header className="admin-header">
        <div className="stats">
          <span className="stat">Total: {blogs.length}</span>
          <span className="stat published">Published: {blogs.filter(b => b.status === 'published').length}</span>
          <span className="stat review">In Review: {blogs.filter(b => b.status === 'inReview').length}</span>
          <span className="stat rejected">Rejected: {blogs.filter(b => b.status === 'rejected').length}</span>
        </div>
      </header>

      <div className="admin-content">
        <div className="sidebar">
          <div className="filters">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search blogs..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="inReview">In Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <button className="refresh-btn" onClick={fetchBlogs}>
              Refresh Data
            </button>
          </div>
        </div>

        <div className="main-content">
          {loading ? (
            <div className="loading">Loading blogs...</div>
          ) : (
            <>
              <div className="blog-list">
                {filteredBlogs.map(blog => (
                  <div
                    key={blog.id}
                    className={`blog-card ${selectedBlog?.id === blog.id ? 'selected' : ''} ${blog.status}`}
                    onClick={() => setSelectedBlog(blog)}
                  >
                    <div className="blog-thumbnail-admin">
                      {blog.thumbnailUrl ? (
                        <img src={blog.thumbnailUrl} alt={blog.title} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="blog-info">
                      <h4>{blog.title}</h4>
                      <p>{blog.description}</p>
                      <div className="blog-meta-admin">
                        <span className={`status ${blog.status}`}>{blog.status}</span>
                        <span className="category">{blog.category}</span>
                        <span className="date">
                          {blog.createdAt?.toDate?.()?.toLocaleDateString() || 'No date'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {selectedBlog && (
          <div className="blog-editor">
            <div className="editor-header">
              <h3>{editMode ? 'Edit Blog' : 'Blog Details'}</h3>
              <div className="editor-actions">
                {!editMode ? (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </button>
                    <select
                      value={selectedBlog.status}
                      onChange={(e) => updateBlogStatus(selectedBlog.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="inReview">In Review</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBlog(selectedBlog.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => {
                        const formData = new FormData(document.getElementById('blog-form'));
                        const blogData = {
                          title: formData.get('title'),
                          description: formData.get('description'),
                          content: formData.get('content'),
                          category: formData.get('category'),
                          subCategory: formData.get('subCategory'),
                          tags: formData.get('tags').split(',').map(tag => tag.trim()),
                          seoTitle: formData.get('seoTitle'),
                          seoKeywords: formData.get('seoKeywords').split(',').map(keyword => keyword.trim()),
                        };
                        saveBlogChanges(blogData);
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="editor-content">
              {editMode ? (
                <form id="blog-form" className="blog-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={selectedBlog.title}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        type="text"
                        name="category"
                        defaultValue={selectedBlog.category}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Sub Category</label>
                      <input
                        type="text"
                        name="subCategory"
                        defaultValue={selectedBlog.subCategory}
                      />
                    </div>
                    <div className="form-group">
                      <label>SEO Title</label>
                      <input
                        type="text"
                        name="seoTitle"
                        defaultValue={selectedBlog.seoTitle}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      defaultValue={selectedBlog.description}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input
                        type="text"
                        name="tags"
                        defaultValue={selectedBlog.tags?.join(', ')}
                      />
                    </div>
                    <div className="form-group">
                      <label>SEO Keywords (comma separated)</label>
                      <input
                        type="text"
                        name="seoKeywords"
                        defaultValue={selectedBlog.seoKeywords?.join(', ')}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Content (Markdown)</label>
                    <textarea
                      name="content"
                      rows="15"
                      defaultValue={selectedBlog.content}
                      className="content-editor"
                    />
                  </div>

                  <div className="form-group">
                    <label>Thumbnail Image</label>
                    <div className="thumbnail-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            uploadThumbnail(e.target.files[0]);
                          }
                        }}
                        disabled={uploading}
                      />
                      {uploading && <span>Uploading...</span>}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="blog-preview">
                  <div className="preview-meta">
                    <div className="meta-row">
                      <strong>Status:</strong> <span className={`status ${selectedBlog.status}`}>{selectedBlog.status}</span>
                      <strong>Category:</strong> {selectedBlog.category}
                      <strong>Sub Category:</strong> {selectedBlog.subCategory}
                    </div>
                    <div className="meta-row">
                      <strong>Created:</strong> {selectedBlog.createdAt?.toDate?.()?.toLocaleString() || 'No date'}
                      <strong>Views:</strong> {selectedBlog.viewsCount || 0}
                      <strong>Read Time:</strong> {selectedBlog.readTime || 0} min
                    </div>
                  </div>

                  <div className="preview-content">
                    <h2>{selectedBlog.title}</h2>
                    <p className="description">{selectedBlog.description}</p>
                    
                    {selectedBlog.thumbnailUrl && (
                      <div className="preview-image">
                        <img src={selectedBlog.thumbnailUrl} alt={selectedBlog.title} />
                      </div>
                    )}

                    <div className="tags">
                      {selectedBlog.tags?.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>

                    <div className="content-preview">
                      <pre>{selectedBlog.content}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default AdminPage;