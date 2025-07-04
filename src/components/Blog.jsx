import BlogService from '../services/blogs'

// Blog component to display individual blog posts
// It includes a button to toggle the extended view of the blog details
// The extended view shows the URL, likes, and the user who added the blog
// onToggle is a callback function to handle the toggle state
const Blog = ({ user, blog, onToggle, onSuccess, onError }) => {
  //console.log('Blog component rendered with blog:', blog)
  //console.log('User in Blog component:', user)
  const isUserBlogAuthor =
    user && blog.user && user.username === blog.user.username ? true : false

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null // send only user id if present
    }
    try {
      await BlogService.update(blog.id, updatedBlog)
      console.log('Blog likes updated successfully:', updatedBlog)
      // Update the blog state to reflect the new likes count
      //onToggle(!blog.extendedView) // Toggle the view after liking
      onSuccess?.(`You liked "${blog.title}" by "${blog.author}"`)
    } catch (error) {
      console.error('Error updating blog likes:', error)
    }
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await BlogService.deleteBlog(blog.id)
        console.log('Blog deleted successfully:', blog.id)
        onSuccess?.(`Blog "${blog.title}" by "${blog.author}" deleted`)
      } catch (error) {
        console.error('Error deleting blog:', error)
        onError?.(`Failed to delete blog "${blog.title}"`)
      }
    }
  }

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
            Likes: {blog.likes}{' '}
            <button onClick={handleLike}>like</button>
          </p>
          <p>Added by: {blog.user ? blog.user.name : 'Unknown'}</p>
          {isUserBlogAuthor && (
            <button onClick={deleteBlog} style={{ color: 'red' }}>
              delete
            </button>
            
          )}
          <p></p>
        </div>
      )}
    </div>
  )
}

export default Blog