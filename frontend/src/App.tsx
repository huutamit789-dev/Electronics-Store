import { useEffect } from 'react';
import axiosClient from './api/axiosClient';

function App() {
  useEffect(() => {
    axiosClient.get('/products') // Thay bằng endpoint của bạn
      .then(res => console.log('Kết nối thành công:', res.data))
      .catch(err => console.log('Lỗi kết nối:', err));
  }, []);

  return <h1>Hello ElectricStore</h1>;
}

export default App;