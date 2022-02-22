import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGetAll } from '../apis';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: .5rem;
`;

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Lists = () => {
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const makeFullHref = (href: string) => {
    return `https://www.youtube.com/playlist?list=${href}`;
  };

  useEffect(() => {
    if (!localStorage.getItem('isLogin')) {
      navigate('/login');
    }
    const fetchData = async () => {
      await listGetAll()
        .then((res) => {
          setItems(res.data);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            localStorage.setItem('isLogin', 'false');
            navigate('/login');
          }
          else {
          }
        });
    }
    fetchData()

    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      {items
        .slice()
        .reverse()
        .map((item) => {
          return (
            <ItemContainer key={item.id}>
              <div>{item.name}</div>
              <a href={makeFullHref(item.href)}>YOUTUBE LINK</a>
            </ItemContainer>
          );
        })}
    </Container>
  );
};

export default Lists;
