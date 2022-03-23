import styled from 'styled-components';

interface ItemBoxProps {
  current: boolean
}

const ListViewer = styled.div`
  position: absolute;
  top: 4rem;
  left: 0;
  width: 100vw;
  height: calc(100vh - 4rem);
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: white;
`;

const ItemBox = styled.div`
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-weight: ${(props: ItemBoxProps) => props.current ? 700 : 400};
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
    <ListViewer>
      <button onClick={close}>close</button>
      {items.map((item: any, index: number) => {
        if (item.title === 'Deleted video') return null;
        return (
          <ItemBox
            key={item.href}
            onClick={() => {
              choice(index);
              close()
            }}
            current={index === queue ? true : false}
          >
            <ItemTitle>{item.name}</ItemTitle>
            <ItemOwnerChannel>{item.uploader}</ItemOwnerChannel>
          </ItemBox>
        );
      })}
    </ListViewer>
  );
};

export default PlayerList;
