import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Lists from './pages/Lists';

const Container = styled.div`
  height: 50vh;
  min-height: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <Container>
      <Nav />
      <Routes>
        <Route path='/' element={<Home isLogin={isLogin} />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/callback'
          element={<Callback isLogin={isLogin} setIsLogin={setIsLogin} />}
        />
        <Route path='/lists' element={<Lists />} />
      </Routes>
    </Container>
  );
}

export default App;
