import axios from 'axios';

axios.defaults.withCredentials = true;

export const login = (code: string) => {
  return axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { code });
};

export const logout = () => {
  return axios.post(`${process.env.REACT_APP_API_URL}/users/logout`, {});
};

export const listGetAll = () => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists`)
    .then((result) => result.data)
    .catch((err) => err);
};

export const listSearch = (q: string) => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists/search?q=${q}`)
    .then((result) => result.data);
};

export const listAdd = (listData: { name: string; href: string }) => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/lists`, listData)
    .then((result) => result.data);
};

export const listDelete = (hrefs: string[]) => {
  return axios
    .delete(`${process.env.REACT_APP_API_URL}/lists`, { data: hrefs })
    .then((result) => result.data);
};

export const quotaCheck = () => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/lists/quota`)
    .then((result) => result.data);
};

export const playerId = (hrefs: string[]) => {
  return axios
    .post(`${process.env.REACT_APP_API_URL}/player`, hrefs)
    .then((result) => result.data);
};

export const playerItems = (id: number) => {
  return axios
    .get(`${process.env.REACT_APP_API_URL}/player/${id}`)
    .then((result) => result.data);
};

export const playerChatDelete = (
  id: number,
  chat: {
    userId: number;
    username: string;
    chat: string;
    addedAt: Date;
  }
) => {
  return axios
    .delete(`${process.env.REACT_APP_API_URL}/player/${id}`, { data: chat })
    .then((result) => result.data);
};
