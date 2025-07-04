import axios from 'axios'
const baseUrl = '/api/login'

// Tämä funktio hoitaa käyttäjän kirjautumisen lähettämällä tunnukset API:lle
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }