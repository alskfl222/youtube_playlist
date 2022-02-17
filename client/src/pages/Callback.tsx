import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import QueryString from 'qs';
// import styled from 'styled-components';

const Callback = (props: any) => {
  const { isLogin, setIsLogin } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const code = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  }).code;

  useEffect(() => {
    if (isLogin) {
      setTimeout(() => navigate('/lists'), 3000);
    }
  // eslint-disable-next-line
  }, [isLogin]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        { code },
        { withCredentials: true }
      )
      .then((result) => {
        setIsLogin(true);
        localStorage.setItem('isLogin', 'true')
      });
  // eslint-disable-next-line
  }, []);

  return <div>구글 계정으로 로그인 중입니다</div>;
};

export default Callback;
