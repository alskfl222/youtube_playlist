import styled from 'styled-components';

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
`

const ListViewer = styled.div`
  position: relative;
  top: 4rem;
  width: calc(100% - 4rem);
  height: calc(100vh - 4rem);
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: white;
  overflow: scroll;
`;

const CloseBtn = styled.button`
  padding: 2rem;
  font-size: 1.5rem;
`

const ItemBox = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-weight: ${(props: { current: boolean }) => (props.current ? 700 : 400)};
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
  const { items, queue, choice, close } = props;
  return (
    <Backdrop>
      <ListViewer>
        <CloseBtn onClick={close}>close</CloseBtn>
        {items.map((item: any, index: number) => {
          if (item.title === 'Deleted video') return null;
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
