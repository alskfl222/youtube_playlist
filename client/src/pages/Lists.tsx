import { useState } from 'react';
import ControlList from '../components/ControlList';
import SearchList from '../components/SearchList';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  margin: 4rem 0 2rem 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden scroll;
`;

const Tab = styled.div`
  position: fixed;
  top: 4rem;
  width: 100%;
  height: 5rem;
  z-index: 1000;
  padding-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
  background-color: #fcfcfc;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
`;

const TabTitle = styled.button<{ view: boolean }>`
  width: 30%;
  min-width: 10rem;
  font-size: 2rem;
  font-weight: ${(props) => (props.view ? 700 : 400)};
  text-align: center;
  border: none;
  border-bottom: ${props => props.view ? '2px solid black' : '1px solid black'};
  background-color: transparent;
  cursor: pointer;
`;

const Lists = () => {
  const [view, setView] = useState<number>(1);

  const tabTitles = ['검색', '목록'];

  const handleView = (value: number) => {
    setView(value);
  };

  const tabContents = [<SearchList />, <ControlList />];

  return (
    <Container>
      <Tab>
        {tabTitles.map((tab, idx) => (
          <TabTitle
            key={idx}
            view={idx === view ? true : false}
            onClick={() => handleView(idx)}
          >
            {tab}
          </TabTitle>
        ))}
      </Tab>
      {tabContents[view]}
    </Container>
  );
};

export default Lists;
