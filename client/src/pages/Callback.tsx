import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Login } from '../apis';
import QueryString from 'qs';
// import styled from 'styled-components';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const code = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  }).code;

  useEffect(() => {
  Login(code as string)
      .then((result) => {
        localStorage.setItem('isLogin', 'true')
        setTimeout(() => navigate('/lists'), 3000);
      });
  // eslint-disable-next-line
  }, []);

  return <div>구글 로그인 중입니다</div>;
};

export default Callback;
