import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGetAll } from '../apis';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PlayerBtn = styled.button`

`
const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ControlList = () => {
  const [listItems, setListItems] = useState<any[]>([]);
  const navigate = useNavigate();

  const makeFullHref = (href: string) => {
    return `https://www.youtube.com/playlist?list=${href}`;
  };
  const handlePlayerBtn = () => {
    navigate('/player')
  }

  useEffect(() => {
    const fetchData = async () => {
      await listGetAll()
        .then((res) => {
          if (res.response && res.response.status === 401) {
            localStorage.setItem('isLogin', 'false');
            navigate('/login');
          }
          return res.data;
        })
        .then((data) => {
          setListItems(data.list);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();

    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <PlayerBtn onClick={handlePlayerBtn}>PLAYER</PlayerBtn>
      {listItems &&
        listItems
          .slice()
          .reverse()
          .map((list) => {
            return (
              <ItemContainer key={list.id}>
                <div>{list.name}</div>
                <a href={makeFullHref(list.href)}>YOUTUBE LINK</a>
              </ItemContainer>
            );
          })}
    </Container>
  );
};

export default ControlList;
