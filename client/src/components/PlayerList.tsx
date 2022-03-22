import styled from 'styled-components';

const ListViewer = styled.div`
  position: absolute;
  top: 4rem;
  left: 0;
  width: 100vw;
  height: calc(100vh - 4rem);
`;

const PlayerList = (props: any) => {
  const { items, close } = props;
  return (
    <ListViewer>
      <button onClick={close}>close</button>
      {items.map((item: any) => {
        return <div key={item.songHref}>{item.title}</div>;
      })}
    </ListViewer>
  );
};

export default PlayerList;
