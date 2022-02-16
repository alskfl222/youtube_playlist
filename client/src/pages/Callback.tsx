import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import QueryString from 'qs';
import styled from 'styled-components';

const Callback = (props: any) => {
  const { isLogin, setIsLogin } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const code = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  }).code;

  useEffect(() => {
    if (isLogin) {
      setTimeout(() => navigate('/lists'), 20000);
    }
  }, [isLogin]);

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, { code })
      .then((result) => {
        setIsLogin(true)
      });
  }, []);

  return <div>구글 계정으로 로그인 중입니다</div>;
};

export default Callback;
