import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

// 5.6 Komponentti uuden blogin luomiseen
const BlogForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: ''
  })

  // Tilamuutosten käsittely tekstikentissä käyttäen useState-hookia
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Lomakkeen lähetys backend-palvelimelle
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await blogService.create(formData)
      console.log('Blog creation response:', response)
      setFormData({
        title: '',
        author: '',
        url: ''
      })
      onSuccess?.(`A new blog called "${formData.title}" by "${formData.author}" added`)
    } catch (error) {
      console.error('Error creating blog:', error)
      const message = error?.response?.data?.error || 'Submission failed'
      onError?.(message) // ✅ Call the error handler
    }
  }

  // Lomakkeen renderöinti
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div>
        <label htmlFor="title">Title:</label><br />
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label htmlFor='author'>Author:</label><br />
        <input
          id="author"
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label htmlFor='url'>URL:</label><br />
        <input
          id='url'
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
        />
      </div>
      <button id="blog-create" type="submit" style={{ marginTop: '20px' }}>Send</button>
    </form>
  )
}
// PropType-määrittelyt antavat palautetta, jos propseja puuttuu tai ne ovat väärän tyyppisiä
BlogForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
}

export default BlogForm
