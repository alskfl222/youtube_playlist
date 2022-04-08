import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Lists from './pages/Lists';
import Player from './pages/Player';
import Footer from './components/Footer';

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  min-width: 320px;
  max-width: calc(960px + 2rem);
  height: 100%;
  min-height: 720px;
  padding: 5rem 1rem 0 1rem;
`;

function App() {
  const location = useLocation();

  return (
    <Container>
      {location.pathname !== '/' && <Nav />}
      <ContentContainer>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/callback' element={<Callback />} />
          <Route path='/lists' element={<Lists />} />
          <Route path='/player/:id' element={<Player />} />
        </Routes>
      </ContentContainer>
      <Footer />
    </Container>
  );
}

export default App;
