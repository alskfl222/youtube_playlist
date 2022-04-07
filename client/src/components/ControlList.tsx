import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGetAll, listDelete, playerId } from '../apis';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 5rem;
  display: flex;
  flex-direction: column;
`;

const PlayerBtn = styled.button``;
const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ControlList = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userinfo, setUserinfo] = useState<{
    userId: number;
    username: string;
  }>({ userId: -1, username: 'guest' });
  const [listItems, setListItems] = useState<any[]>([]);
  const [check, setCheck] = useState<any[]>([]);
  const navigate = useNavigate();

  const makeFullHref = (href: string) => {
    return `https://www.youtube.com/playlist?list=${href}`;
  };
  const handlePlayerBtn = () => {
    const hrefs = check.map((list) => list.href) as string[];
    playerId(hrefs)
      .then((res) => {
        navigate(`/player/${res.playerId}`, { state: userinfo });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteBtn = () => {
    const hrefs = check.map((list) => list.href) as string[];
    listDelete(hrefs)
      .then((res) => {
        setListItems((before) =>
          listItems.filter((list) => !hrefs.includes(list.href))
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCheckbox = (item: any) => {
    console.log(!JSON.parse(localStorage.getItem('isLogin') as string));
    if (!JSON.parse(localStorage.getItem('isLogin') as string)) {
      setCheck((check) => [item]);
      return;
    }
    const hrefs = check.map((el) => el.href);
    if (hrefs.includes(item.href)) {
      setCheck(check.filter((el) => el.href !== item.href));
    } else {
      setCheck([...check, item]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await listGetAll()
        .then((res) => {
          setListItems((listItems) => res.lists);
          if (res.username) {
            setIsLogin((isLogin) => true);
            localStorage.setItem('isLogin', 'true');
            const resUserInfo = { userId: res.userId, username: res.username };
            setUserinfo((userinfo) => resUserInfo);
          } else {
            setIsLogin((isLogin) => false);
            localStorage.setItem('isLogin', 'false');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);
  console.log(check);

  return (
    <Container>
      <PlayerBtn onClick={handlePlayerBtn}>PLAYER</PlayerBtn>
      <button onClick={handleDeleteBtn}>delete</button>
      {listItems &&
        listItems
          .slice()
          .reverse()
          .map((list) => {
            return (
              <ItemContainer key={list.href}>
                {isLogin ? (
                  <input
                    type='checkbox'
                    onChange={() => handleCheckbox(list)}
                  ></input>
                ) : (
                  <input
                    type='radio'
                    name='checked-list'
                    onChange={() => handleCheckbox(list)}
                  ></input>
                )}
                <div>{list.name}</div>
                <a href={makeFullHref(list.href)}>YOUTUBE LINK</a>
              </ItemContainer>
            );
          })}
    </Container>
  );
};

export default ControlList;
