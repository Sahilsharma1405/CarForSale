import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

// This instance is for regular JSON data (GET requests, sending text)
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is a NEW, separate instance specifically for file uploads (FormData)
const axiosUploadInstance = axios.create({
  baseURL: baseURL,
  // We DO NOT set a default Content-Type here
});


// --- Interceptors ---
// This function attaches the auth token to any request that needs it
const authInterceptor = (config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

// Apply the interceptor to BOTH instances
axiosInstance.interceptors.request.use(authInterceptor);
axiosUploadInstance.interceptors.request.use(authInterceptor);


// This interceptor handles refreshing the token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const rs = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken });
          const { access } = rs.data;
          localStorage.setItem('accessToken', access);
          
          // Update the header for the original request and retry it
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (_error) {
          // Handle failed refresh
        }
      }
    }
    return Promise.reject(error);
  }
);

// Export both instances so other files can use them
export { axiosInstance, axiosUploadInstance };