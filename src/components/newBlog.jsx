import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ onSuccess, onError}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await blogService.create(formData);
      console.log('Blog creation response:', response);
      setFormData({
        title: '',
        author: '',
        url: ''
      });
      onSuccess?.()
    } catch (error) {
      console.error('Error creating blog:', error);
      const message = error?.response?.data?.error || 'Submission failed';
      onError?.(message); // ✅ Call the error handler
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div>
        <label>Title:</label><br />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Author:</label><br />
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>URL:</label><br />
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" style={{ marginTop: '20px' }}>Send</button>
    </form>
  );
};

export default BlogForm
