import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LandingTitle = styled.p`
  margin-bottom: 1rem;
  text-align: center;
  line-height: 3.5rem;
  font-size: 3rem;
  font-weight: 700;

  @media (max-width: 480px) {
    margin-bottom: 3rem;
  }
`;

const LandingDesc = styled.p`
  margin-bottom: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;
  @media (max-width: 480px) {
    display: none;
  }
`;

const ImgBox = styled.div`
  width: 80vw;
  max-width: calc(960px);
  height: 45vw;
  max-height: calc(960px * 9 / 16);
  border: 1px solid black;
`;

const Horizon = styled.div`
  width: 80vw;
  max-width: 720px;
  margin: 1rem 0;
  border-bottom: 1px solid black;
`;

const Link = styled.a`
  text-decoration: none;
  color: black;
  font-size: 1.2rem;
  font-weight: 500;
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ImgBox />
      <LandingTitle>
        YOUTUBE
        <br />+<br />
        PLAYLIST
      </LandingTitle>
      <LandingDesc>
        유튜브 재생목록을
        <br />
        관리할 수 있습니다
      </LandingDesc>
      <Link href={`${process.env.REACT_APP_CLIENT_URL}/login`}>
        나만의 목록 만들기
      </Link>
      <Horizon />
      <Link href={`${process.env.REACT_APP_CLIENT_URL}/lists`}>
        기존 목록 보기
      </Link>
    </Container>
  );
};

export default Home;
