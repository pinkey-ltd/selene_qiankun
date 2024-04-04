import axios from "axios";

// create an axios instance
const service = axios.create({
  baseURL: "/", // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
});

export default service;

