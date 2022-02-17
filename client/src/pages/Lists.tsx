import { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Lists = () => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/lists`, { withCredentials: true })
      .then((res) => console.log(res));
  }, []);

  return <Container>Lists</Container>;
};

export default Lists;
