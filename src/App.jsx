import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import NewBlog from './components/newBlog'
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

      // 5.10 Blogien lajittelu tykkäysten mukaan
      setBlogs(prevBlogs => {
        const merged = fetchedBlogs
          .sort((a, b) => b.likes - a.likes)
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
  // 5.1 Käyttäjän kirjautuminen
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

  // 5.9 Tykkäys renderöi onnistuneesti myös blogin lisänneen käyttäjän nimen
  // Näytetään onnistumisilmoitus ja ladataan blogit uudelleen
  const handleInfo = (message) => {
    setInfoMessage(message)
    setTimeout(() => setInfoMessage(null), 5000) // Tyhjennetään viesti 5 sekunnin kuluttua
    loadBlogs() // Ladataan blogit uudelleen onnistuneen toiminnon jälkeen
  }

  // 5.1 Kirjautumislomakkeen näyttäminen/piilottaminen ehdollisesti
  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button id="login" onClick={() => setLoginVisible(true)}>kirjaudu sisään</button>
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
  // 5.3 Kirjautunut käyttäjä näkee lomakkeen uuden blogin luomiseen
  return (
    <div>
      <h1>Blogisovellus</h1>
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} kirjautunut sisään</p>
        <button id="logout-button" onClick={() => { // 5.2 Uloskirjautumista
          window.localStorage.removeItem('loggedBlogappUser')
          setUser(null)
          setLoginVisible(false)
        }}>kirjaudu ulos</button>
        <p></p>
        { /* 5.5 Lomake uuden blogin luomiseen aukeaa napista, joka käyttää Togglable-komponenttia */}
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
      <Notification message={infoMessage} /> {/* 5.4 Näytetään ilmoitukset käyttäjälle esteettisistä syistä sovelluksen alalaidassa */}
      <footer style={{ fontSize: '0.85em', lineHeight: 1 }}>
        <p>Blogisovellus, Full Stack Open 2025</p>
        <p>Tekijä: Ville-Juhani Nivasalo</p>
      </footer>
    </div>
  )
}

export default App