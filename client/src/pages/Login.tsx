import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Device } from '../styles';
import GoogleLoginNormal from '../images/btn_google_signin_light_normal_web@2x.png';
import GoogleLoginFocus from '../images/btn_google_signin_light_focus_web@2x.png';
import GoogleLoginPressed from '../images/btn_google_signin_light_pressed_web@2x.png';

const Container = styled.div`
  height: 540px;
  display: flex;
  justify-content: center;
`;

const BorderBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fcfcfc;
  border-radius: 1rem;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.2);
  
  img {
    max-width: 100%;
    height: auto;
    padding: 0 1rem;
  }

  @media ${Device.tablet} {
    width: 768px;
    margin-top: 5rem;
    padding: 2rem;
    flex-direction: row;
    justify-content: space-evenly;
  }
`;

const Title = styled.p`
  text-align: center;
  line-height: 3.5rem;
  font-size: 3rem;
  font-weight: 700;
`;

const HorizonLine = styled.div`
  width: 80vw;
  max-width: 480px;
  margin: 1rem 0;
  border-bottom: 1px solid black;

  @media ${Device.tablet} {
    display: none;
  }
`;

const VerticalLine = styled.div`
  display: none;
  height: 320px;
  margin: 0 1rem;
  border-right: 1px solid black;

  @media ${Device.tablet} {
    display: block;
  }
`;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('isLogin') as string)) {
      navigate('/lists');
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <BorderBox>
        <Title>
          YOUTUBE
          <br />+<br />
          PLAYLIST
          <br />
          <br />
          LOGIN
        </Title>
        <HorizonLine />
        <VerticalLine />
        <a href={`${process.env.REACT_APP_API_URL}/users/auth`}>
          <img
            src={GoogleLoginNormal}
            onMouseOver={(e) => (e.currentTarget.src = GoogleLoginFocus)}
            onMouseOut={(e) => (e.currentTarget.src = GoogleLoginNormal)}
            onClick={(e) => (e.currentTarget.src = GoogleLoginPressed)}
          />
        </a>
      </BorderBox>
    </Container>
  );
};

export default Login;
