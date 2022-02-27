import axios from 'axios';

axios.defaults.withCredentials = true;

export const Login = (code: string) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { code });
};

export const listGetAll = () => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists`)
    .then((result) => result.data)
    .catch((err) => err);
};

export const searchList = (q: string) => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists/search?q=${q}`)
    .then((result) => result.data);
};
