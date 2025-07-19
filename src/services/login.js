import axios from 'axios'
const baseUrl = '/api/login'

// 5.1 Kirjautumispalvelu
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }