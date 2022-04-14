import styled from 'styled-components';
import { YouTube } from '@mui/icons-material';

const Backdrop = styled.div`
  position: fixed;
  bottom: -100%;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  transition: bottom 1s cubic-bezier(0.075, 0.82, 0.165, 1);

  &.open {
    bottom: 0;
  }
`;

const ListViewer = styled.div`
  position: absolute;
  top: 5rem;
  width: calc(100% - 4rem);
  min-width: 360px;
  max-width: 960px;
  height: calc(100vh - 5rem);
  z-index: 2001;
  padding: 2rem;
  padding-bottom: 7rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 1rem 1rem 0 0;
  background-color: white;
  overflow: hidden scroll;
`;

const CloseBtn = styled.button`
  position: fixed;
  left: 25%;
  bottom: 3rem;
  width: 50%;
  margin: 1rem 0;
  padding: 1rem;
  display: ${(props: { isOpen: boolean }) => (props.isOpen ? 'flex' : 'none')};
  justify-content: space-around;
  align-items: center;
  border-radius: 1rem;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease-in-out;

  &:hover {
    background-color: rgb(99, 99, 99);
  }

  @media (min-width: 768px) {
    &::before {
      content: '목록 닫기';
      font-size: 1.5rem;
    }
  }
`;

const ItemBox = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: ${(props: { current: boolean }) => (props.current ? '#f6c' : '#000')};

  &:hover {
    font-weight: 700;
  }
`;

const ItemTitle = styled.span`
  width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemOwnerChannel = styled.span`
  width: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayerList = (props: any) => {
  const { items, queue, choice, isOpen, close } = props;
  return (
    <Backdrop
      className={isOpen ? 'open' : ''}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.className = '';
          close();
        }
      }}
    >
      <ListViewer>
        <CloseBtn isOpen={isOpen} onClick={close}>
          <YouTube sx={{ fontSize: '2rem' }} />
        </CloseBtn>
        {items.map((item: any, index: number) => {
          if (item.name === 'Deleted video' || item.name === 'Private video')
            return null;
          return (
            <ItemBox
              key={item.href + index}
              onClick={() => {
                choice(index);
                close();
              }}
              current={index === queue ? true : false}
            >
              <ItemTitle>{item.name}</ItemTitle>
              <ItemOwnerChannel>{item.uploader}</ItemOwnerChannel>
            </ItemBox>
          );
        })}
      </ListViewer>
    </Backdrop>
  );
};

export default PlayerList;
