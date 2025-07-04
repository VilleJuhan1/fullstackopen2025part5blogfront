import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// Tämä funktio hakee kaikki blogipostaukset API:sta
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// Tämä funktio asettaa tokenin autentikoituja pyyntöjä varten
const setToken = (personalToken) => {
  token = `Bearer ${personalToken}`
  console.log('Token asetettu:', token)
}

// Tämä funktio luo uuden blogipostauksen
const create = (newObject) => {
  console.log('create kutsuttu parametrilla:', newObject)
  const config = {
    headers: { Authorization: token }
  }
  //console.log('Pyynnön konfiguraatio:', config)
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

// Tämä funktio päivittää olemassa olevan blogipostauksen
const update = (id, newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.put(`${baseUrl}/${id}`, newObject, config)
  return request.then(response => response.data)
}

// Tämä funktio poistaa blogipostauksen
const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, setToken, create, update, deleteBlog }