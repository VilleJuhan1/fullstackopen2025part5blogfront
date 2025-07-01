import axios from 'axios'
const baseUrl = '/api/login'

// This function handles user login by sending credentials to the API
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }