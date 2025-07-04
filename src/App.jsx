import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    loadBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('user from localStorage', user)
      setUser(user)
      blogService.setToken(user.token)
    } 
  }, [])

  const loadBlogs = async () => {
    try {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      console.error('Error loading blogs:', error)
      setInfoMessage('Failed to load blogs')
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

  // Handle login form submission
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userTmp = await loginService.login({
        username, password,
      })
      console.log('user', userTmp)
      // Store user in localStorage
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userTmp)
      )
      // Remove the user from localStorage after 1 hour (3600000 ms)
      setTimeout(() => {
        window.localStorage.removeItem('loggedBlogappUser')
      }, 3600000)
      blogService.setToken(userTmp.token)
      setUser(userTmp)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setInfoMessage('wrong username or password')
      console.error('Login error:', exception)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

  const handleError = (message) => {
    setInfoMessage(message)
    setTimeout(() => setInfoMessage(null), 5000) // Clear after 5s (optional)
  }

  const handleInfo = (message) => {
    setInfoMessage(message);
    setTimeout(() => setInfoMessage(null), 5000) // Clear after 5s
    loadBlogs(); // Reload blogs after successful operation
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  /*
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  

  // If user is not logged in, show login form
  if (user === null) {
    return (
      <div>
        <h1>Please log in to application</h1>
        <Notification message={infoMessage} />
        {loginForm()}
      </div>
    )
  }
    */

  // If user is logged in, show the main application
  return (
    <div>
      <h1>Blog app</h1>
      <Notification message={infoMessage} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>

      <button onClick={() => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        setLoginVisible(false)
      }}>logout</button>
      </div>}
      <p></p>
      <NewBlog onSuccess={handleInfo} onError={handleError} />
      <h2>Blogs recommended by users</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App