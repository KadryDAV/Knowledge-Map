import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Adjust the baseURL as needed
  withCredentials: true,
});

export default api;
