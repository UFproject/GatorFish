import axios from "axios"

const request = axios.create({
  // baseURL: 'http://localhost:3004',
  baseURL: 'http://35.172.221.61:8080',
  timeout: 5000
})

request.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_key')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error);
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data;
  }, (error) => {
    return Promise.reject(error);
  }
)

export { request }