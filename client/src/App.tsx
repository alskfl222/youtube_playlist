import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Callback from './pages/Callback';
import Lists from './pages/Lists';

const Container = styled.div`
  width: 100vw;
  min-width: 320px;
  max-width: 992px;
  min-height: 720px;
  padding: 5rem 1rem 0 1rem;
  display: flex;
`;

function App() {
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("isLogin"));
  return (
    <Container>
      <Nav />
      <main>
        <Routes>
          <Route path='/' element={<Home isLogin={isLogin} />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/callback'
            element={<Callback isLogin={isLogin} setIsLogin={setIsLogin} />}
          />
          <Route path='/lists' element={<Lists />} />
        </Routes>
      </main>
    </Container>
  );
}

export default App;
