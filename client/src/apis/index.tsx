import axios from 'axios';

axios.defaults.withCredentials = true;

export const listGetAll = () => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists`)
    .then((result) => result.data)
    .catch((err) => err);
};
