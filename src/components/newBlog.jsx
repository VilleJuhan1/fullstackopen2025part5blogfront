import { useState } from 'react'
import blogService from '../services/blogs'

// BlogForm component for creating new blog posts
// It includes fields for title, author, and URL
// It handles form submission and error/success notifications
const BlogForm = ({ onSuccess, onError}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: ''
  })

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await blogService.create(formData);
      console.log('Blog creation response:', response);
      setFormData({
        title: '',
        author: '',
        url: ''
      });
      onSuccess?.(`A new blog called "${formData.title}" by "${formData.author}" added`); // ✅ Call the success handler
    } catch (error) {
      console.error('Error creating blog:', error)
      const message = error?.response?.data?.error || 'Submission failed'
      onError?.(message); // ✅ Call the error handler
    }
  };

  // Render the form with controlled inputs
  // Each input field is controlled by the state
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
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
