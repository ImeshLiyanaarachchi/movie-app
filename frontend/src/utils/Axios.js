import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  // You can add headers or interceptors here if needed
});

export default axiosInstance; 