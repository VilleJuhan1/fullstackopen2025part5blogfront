import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

// This function retrieves all blog posts from the API
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// This function sets the token for authenticated requests
const setToken = (personalToken) => {
  token = `Bearer ${personalToken}`
  // This function can be used to set the token for API requests
  // For example, you might want to set it in a service or context
  console.log('Token set:', token)
}

// This function creates a new blog post
const create = (newObject) => {
  console.log('create called with:', newObject)
  const config = {
    headers: { Authorization: token }
  }
  //console.log('Config for request:', config)
  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

export default { getAll, setToken, create }