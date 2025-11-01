const API_URL = import.meta.env.MODE === 'production'
  ? 'https://questoes-e-masmorras.onrender.com/api'
  : 'http://localhost:3000/api';

export default API_URL;