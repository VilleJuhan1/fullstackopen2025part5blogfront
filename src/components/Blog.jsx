import BlogService from '../services/blogs'

// Blog component to display individual blog posts
// It includes a button to toggle the extended view of the blog details
// The extended view shows the URL, likes, and the user who added the blog
// onToggle is a callback function to handle the toggle state
const Blog = ({ blog, onToggle }) => {
  return (
    <div
      style={{
        cursor: 'pointer' // Change cursor to pointer for better UX
      }}
    >
      <button onClick={() => onToggle(!blog.extendedView)}>
        {blog.extendedView ? 'Hide' : 'View'}
      </button>
      <span style={{ marginLeft: '0.5rem' }}>
        <strong>{blog.title}</strong> by {blog.author}
      </span>

      {blog.extendedView && (
        <div style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button>like</button>
          </p>
          <p>Added by: {blog.user ? blog.user.name : 'Unknown'}</p>
        </div>
      )}
    </div>
  )
}

/*
({ blog, onToggle }) => {
  return (
    <li>
      <strong>{blog.title}</strong> by {blog.author}

      {!blog.extendedView ? (
        <button onClick={() => onToggle(true)}>View</button>
      ) : (
        <>
          <div>
            <p>Url: {blog.url}</p>
            <p>Likes: {blog.likes}</p>
            <p>Added by {blog.user ? blog.user.name : 'Unknown'}</p>
          </div>
          <button onClick={() => onToggle(false)}>Hide</button>
        </>
      )}
    </li>
  )
}
*/

export default Blog