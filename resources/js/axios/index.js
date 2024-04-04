import axios from "axios";
import Cookies from "js-cookie";


const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Content-Type': 'application/json,multipart/form-data',
    },
});


api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response.data);
    }
  },
  error => {
      if (error.response.status = 422){
          return Promise.reject(error.response);
      }
      else if(error.response.status == 401)
      {
          window.location.href = "/login";
      }
      return Promise.reject(error.response.data.error);
  }
);


export default api;
