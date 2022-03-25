import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavigationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  background-color: #f50;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
`;

const NavContainer = styled.div`
  width: 100vw;
  min-width: 320px;
  max-width: calc(960px + 2rem);
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HomeBtn = styled.button`
  border: none;
  background: transparent;
  text-align: center;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`;

const LoginBtn = styled.button`
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid white;
  border-radius: 1rem;
  background: transparent;
  text-align: center;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
`;

const Nav = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('isLogin') as string)) {
      setIsLogin(true)
    }
  }, [])
  const navigate = useNavigate();
  return (
    <NavigationContainer>
      <NavContainer>
        <HomeBtn onClick={() => navigate('/')}>
          YOUTUBE
          <br />
          PLAYLIST
        </HomeBtn>
        {!isLogin && <LoginBtn onClick={() => navigate('/login')}>LOGIN</LoginBtn>}
      </NavContainer>
    </NavigationContainer>
  );
};

export default Nav;
