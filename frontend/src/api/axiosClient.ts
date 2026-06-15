import axios from 'axios';

// Sửa lại cổng thành 8000
const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;