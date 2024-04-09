import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: '/prod-api', // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
})

export default service
