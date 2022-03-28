import styled from 'styled-components';
import { Device } from '../styles';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LandingTitle = styled.p`
  margin-bottom: 3rem;
  text-align: center;
  line-height: 3.5rem;
  font-size: 3rem;
  font-weight: 700;
`;

const LandingDesc = styled.p`
  display: none;
  margin-bottom: 3rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 500;

  @media ${Device.mobile} {
    display: block;
  }
`;

const HorizonLine = styled.div`
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
  return (
    <Container>
      <LandingTitle>
        YOUTUBE
        <br />+<br />
        PLAYLIST
      </LandingTitle>
      <LandingDesc>
        유튜브 재생목록 여러 개를
        <br />
        한번에 이어서 들을 수 있습니다
      </LandingDesc>
      <Link href={`${process.env.REACT_APP_CLIENT_URL}/login`}>
        나만의 목록 만들기
      </Link>
      <HorizonLine />
      <Link href={`${process.env.REACT_APP_CLIENT_URL}/lists`}>
        기존 목록 보기
      </Link>
    </Container>
  );
};

export default Home;
