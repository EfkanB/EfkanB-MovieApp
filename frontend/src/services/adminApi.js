import axios from 'axios';

const authAxios = axios.create({
  // Vite/React tarafında baseURL zaten proxy ile yönetiliyorsa boş bırakıyoruz.
  baseURL: '',
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleAxiosError = (error) => {
  const res = error?.response;
  const message = res?.data?.message || res?.data?.error || error?.message || 'Admin isteği başarısız';
  return Promise.reject(new Error(message));
};

const withData = (promise) => promise.then((r) => r.data).catch(handleAxiosError);

export const adminApi = {
  // Movies
  createMovie: (payload) => withData(authAxios.post('/api/admin/movies', payload)),
  listMovies: () => withData(authAxios.get('/api/admin/movies')),
  getMovieById: (id) => withData(authAxios.get(`/api/admin/movies/${id}`)),
  updateMovie: (id, payload) => withData(authAxios.put(`/api/admin/movies/${id}`, payload)),
  deleteMovie: (id) =>
    withData(
      authAxios.delete(`/api/admin/movies/${id}`).then(() => ({ ok: true }))
    ),

  // Series
  createSeries: (payload) => withData(authAxios.post('/api/admin/series', payload)),
  listSeries: () => withData(authAxios.get('/api/admin/series')),
  getSeriesById: (id) => withData(authAxios.get(`/api/admin/series/${id}`)),
  updateSeries: (id, payload) => withData(authAxios.put(`/api/admin/series/${id}`, payload)),
  deleteSeries: (id) =>
    withData(
      authAxios.delete(`/api/admin/series/${id}`).then(() => ({ ok: true }))
    ),
};

