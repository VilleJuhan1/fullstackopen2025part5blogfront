import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlog from './components/NewBlog'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]) // Blogien tila
  const [infoMessage, setInfoMessage] = useState(null) // Ilmoitusviestin tila
  const [username, setUsername] = useState('') // Käyttäjätunnuksen tila
  const [password, setPassword] = useState('') // Salasanan tila
  const [user, setUser] = useState(null) // Kirjautuneen käyttäjän tila
  const [loginVisible, setLoginVisible] = useState(false) // Näytetäänkö kirjautumislomake

  const blogFormRef = useRef() // Viittaus uuden blogin lomakkeeseen

  useEffect(() => {
    loadBlogs() // Ladataan blogit sovelluksen käynnistyessä
  }, [])

  useEffect(() => {
    // Tarkistetaan onko käyttäjä kirjautunut localStoragessa
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      //console.log('user from localStorage', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Blogien lataaminen palvelimelta
  const loadBlogs = async () => {
    try {
      const fetchedBlogs = await blogService.getAll()

      setBlogs(prevBlogs => {
        const merged = fetchedBlogs
          .sort((a, b) => b.likes - a.likes) // Järjestetään blogit tykkäysten mukaan
          .map(blog => {
            const existing = prevBlogs.find(b => b.id === blog.id)
            return {
              ...blog,
              extendedView: existing?.extendedView ?? false, // Säilytetään extendedView-tieto tai oletus
            }
          })

        return merged
      })

    } catch (error) {
      console.error('Error loading blogs:', error)
      setInfoMessage('Blogien lataus epäonnistui')
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

  // Käsitellään kirjautumislomakkeen lähetys
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const userTmp = await loginService.login({
        username, password,
      })
      console.log('user', userTmp)
      // Tallennetaan käyttäjä localStorageen
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(userTmp)
      )
      // Poistetaan käyttäjä localStoragesta tunnin kuluttua (3600000 ms)
      setTimeout(() => {
        window.localStorage.removeItem('loggedBlogappUser')
      }, 3600000)
      blogService.setToken(userTmp.token)
      setUser(userTmp)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setInfoMessage('väärä käyttäjätunnus tai salasana')
      console.error('Login error:', exception)
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    }
  }

  // Näytetään virheilmoitus
  const handleError = (message) => {
    setInfoMessage(message)
    setTimeout(() => setInfoMessage(null), 5000) // Tyhjennetään viesti 5 sekunnin kuluttua
  }

  // Näytetään onnistumisilmoitus ja ladataan blogit uudelleen
  const handleInfo = (message) => {
    setInfoMessage(message)
    setTimeout(() => setInfoMessage(null), 5000) // Tyhjennetään viesti 5 sekunnin kuluttua
    loadBlogs() // Ladataan blogit uudelleen onnistuneen toiminnon jälkeen
  }

  // Kirjautumislomakkeen näyttäminen/piilottaminen
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>kirjaudu sisään</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>peruuta</button>
        </div>
      </div>
    )
  }

  // Asetetaan blogin extendedView-tila
  const setExtendedView = (id, value) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === id ? { ...blog, extendedView: value } : blog
      )
    )
  }

  // Sovelluksen pääsisältö
  return (
    <div>
      <h1>Blogisovellus</h1>
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} kirjautunut sisään</p>
        <button onClick={() => {
          // Kirjaudutaan ulos
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
          setLoginVisible(false)
        }}>kirjaudu ulos</button>
        <p></p>
        <Togglable buttonLabel='uusi blogi' ref={blogFormRef}>
          <NewBlog
            onSuccess={(message) => {
              handleInfo(message)
              blogFormRef.current && blogFormRef.current.toggleVisibility()
            }}
            onError={handleError}
          />
        </Togglable>
      </div>}
      <h2>Käyttäjien suosittelemat blogit</h2>
      <p>Paina Näytä saadaksesi lisätietoja ja Piilota palataksesi takaisin</p>
      <ul>
        {blogs.map((blog) => (
          <Blog
            user={user ? user : null}  // Välitetään käyttäjä, jos kirjautunut
            onSuccess={(message) => {
              handleInfo(message)
            }}
            key={blog.id}
            blog={blog}
            onToggle={(value) => setExtendedView(blog.id, value)}
          />
        ))}
      </ul>
      <Notification message={infoMessage} /> {/* Ilmoitusviesti */}
      <footer style={{ fontSize: '0.85em', lineHeight: 1 }}>
        <p>Blogisovellus, Full Stack Open 2025</p>
        <p>Tekijä: Ville-Juhani Nivasalo</p>
      </footer>
    </div>
  )
}

export default App