import BlogService from '../services/blogs'
import PropTypes from 'prop-types'

// Blogi-komponentti yksittäisen blogin näyttämiseen
const Blog = ({ user, blog, onToggle, onSuccess, onLike }) => {
  const isUserBlogAuthor =
    user && blog.user && user.username === blog.user.username ? true : false

  // 5.8 Tykkäyspainike
  // Tykkäyksen seurauksena päivitetään blogi käyttäen BlogServicen update-metodia
  // Tämän jälkeen kutsutaan onSuccess callback-funktiota, joka muuttaa sovelluksen tilaa ja lataa sen uudelleen,
  // mikä mahdollistaa tykkäysten päivittymisen UI:ssa
  const handleLike = async () => {
    if (onLike) {
      onLike()
    }
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    }
    try {
      await BlogService.update(blog.id, updatedBlog)
      console.log('Blog likes updated successfully:', updatedBlog)
      onSuccess?.(`You liked "${blog.title}" by "${blog.author}"`)
    } catch (error) {
      console.error('Error updating blog likes:', error)
    }
  }

  // 5.11 Poistopainike
  // Poistetaan blogi käyttäen BlogServicen deleteBlog-metodia
  // Onnistunut poisto kutsuu onSuccess callback-funktiota, joka muuttaa sovelluksen tilaa,
  // mikä lataa sovelluksen uudelleen ja poistaa blogin UI:sta
  const deleteBlog = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await BlogService.deleteBlog(blog.id)
        console.log('Blog deleted successfully:', blog.id)
        onSuccess?.(`Blog "${blog.title}" by "${blog.author}" deleted`)
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  // Blogin renderöinti
  // Ehdollinen renderöinti tehdään extendedView-tilan perusteella,
  // jota hallitaan Hide/Show-painikkeella
  // Poisto-painike näytetään vain, jos käyttäjä on itse lisännyt blogin
  return (
    <div
      className="blog"
      style={{
        cursor: 'pointer'
      }}
    > { /* 5.7 Painike, jolla määritellään, näytetäänkö kaikki vai vain osa tiedoista */}
      <button id="extended-button" onClick={() => onToggle(!blog.extendedView)}>
        {blog.extendedView ? 'Hide' : 'View'}
      </button>
      <span style={{ marginLeft: '0.5rem' }}>
        <strong>{blog.title}</strong> by {blog.author}
      </span>
      {/* Näytetään lisätiedot, jos extendedView on true */}
      {blog.extendedView && (
        <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes}{' '}
            <button className="like-button" id="like-button" onClick={handleLike}>like</button>
          </p>
          <p>Added by: {blog.user ? blog.user.name : 'Unknown'}</p>
          {/* 5.11 Poistopainike */}
          {isUserBlogAuthor && (
            <button id="delete-button" onClick={deleteBlog} style={{ color: 'red' }}>
              delete
            </button>

          )}
          <p></p>
        </div>
      )}
    </div>
  )
}

// PropType-määrittelyt antavat palautetta, jos propseja puuttuu tai ne ovat väärän tyyppisiä
Blog.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  user: PropTypes.object,
  blog: PropTypes.object.isRequired
}

export default Blog