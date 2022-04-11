import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listGetAll, listDelete, playerId } from '../apis';
import styled from 'styled-components';
import { YouTube, Delete, PlaylistPlay } from '@mui/icons-material';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
`;

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 2rem;
`;

const PlayerBtn = styled.button`
  width: 70%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border: none;
  background-color: #fcfcfc;
  font-size: 1.5rem;
  cursor: pointer;

  @media (min-width: 768px) {
    &::before {
      content: '플레이어 재생';
    }
  }
`;

const DeleteBtn = styled(PlayerBtn)`
  width: 30%;
  @media (min-width: 768px) {
    &::before {
      content: '선택목록 삭제';
    }
  }
`;

const ListsContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:last-child {
    padding-bottom: 3rem;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1rem;
  background-color: #fcfcfc;
  box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }

  input {
    width: 5%;
    min-width: 20px;
    transform: scale(1.5);
    cursor: pointer;
  }
  img {
    width: 20%;
    min-width: 96px;
    padding: 1rem;
    border-radius: 4px;
    object-fit: contain;
  }
  div {
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a {
    width: 7.5%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: black;
  }
  button {
    width: 7.5%;
    min-width: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }
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
  const handleMoveToPlayerBtn = () => {
    const hrefs = check.map((list) => list.href) as string[];
    playerId(hrefs)
      .then((res) => {
        navigate(`/player/${res.playerId}`, { state: userinfo });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteBtn = (lists: any[]) => {
    const hrefs = lists.map((list) => list.href) as string[];
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

  return (
    <Container>
      <BtnContainer>
        <PlayerBtn onClick={handleMoveToPlayerBtn}>
          <PlaylistPlay sx={{ fontSize: '2rem' }} />
        </PlayerBtn>
        <DeleteBtn onClick={() => handleDeleteBtn(check)}>
          <Delete sx={{ fontSize: '2rem' }} />
        </DeleteBtn>
      </BtnContainer>
      <ListsContainer>
        {listItems &&
          listItems
            .slice()
            .reverse()
            .map((list) => {
              return (
                <ListContainer
                  key={list.href}
                >
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
                  <img src={list.thumbnail} alt='playlist thumbnail' />
                  <div>{list.name}</div>
                  <a href={makeFullHref(list.href)}>
                    <YouTube sx={{ fontSize: '2rem' }} />
                  </a>
                  <button onClick={() => handleDeleteBtn([list])}>
                    <Delete sx={{ fontSize: '2rem' }} />
                  </button>
                </ListContainer>
              );
            })}
      </ListsContainer>
    </Container>
  );
};

export default ControlList;
