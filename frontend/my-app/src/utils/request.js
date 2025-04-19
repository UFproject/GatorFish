import axios from "axios"

const request = axios.create({
  // baseURL: 'http://localhost:3004',
  baseURL: 'http://3.93.59.122:8080',
  timeout: 5000
})

request.interceptors.request.use((config) => {
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