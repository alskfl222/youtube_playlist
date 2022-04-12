import styled from 'styled-components';
import { GitHub } from '@mui/icons-material';
import { Color } from '../styles';

const Container = styled.div`
  width: 100%;
  height: 8rem;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${Color.primaryLight};
`;

const ProjectTitle = styled.div`
  width: 50%;
  padding: 0 1rem;
  border-right: 1px solid #fcfcfc;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const ProjectDesc = styled.div`
  width: 50%;
  padding: 0 1rem;
  text-align: right;
  vertical-align: middle;
  color: white;
  font-size: 1.5rem;
  font-weight: 400;
  strong {
    font-size: 2rem;
  }
  a {
    vertical-align: middle;
  }
`;

const Footer = () => {
  return (
    <Container>
      <ProjectTitle>
        YOUTUBE
        <br />
        PLAYLIST
      </ProjectTitle>
      <ProjectDesc>
        <strong>ABOUT</strong> <br />
        <div>
          신한결{' '}
          <a href='https://github.com/alskfl222/youtube_playlist'>
            <GitHub sx={{ fontSize: '2rem' }} />
          </a>
        </div>
      </ProjectDesc>
    </Container>
  );
};

export default Footer;
