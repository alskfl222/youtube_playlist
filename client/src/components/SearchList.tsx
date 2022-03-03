import { useEffect, useState } from 'react';
import { checkQuota, searchList } from '../apis';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const SearchBar = styled.input`
  width: 70%;
  min-width: 300px;
  height: 48px;
  padding: 0 1.5rem;
  font-size: 1.5rem;
  border: 1px solid black;
  border-radius: 24px;
`;

const SearchBtn = styled.button`
  width: 60px;
  height: 48px;
  background-color: coral;
  border: none;
  border-radius: 24px;

  &:disabled {
    background-color: #666;
  }
`;

const ResultsContainer = styled.div`
  border: 1px solid black;
`;

const Item = styled.div`
  width: 100%;
  height: 200px;
  border: 1px dashed blue;
`;

const SearchList = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [quota, setQuota] = useState<number>(0);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearchBtn = async () => {
    const response = await searchList(query);
    console.log(response);
  };

  const checkOnMount = async () => {
    const check = await checkQuota();
    console.log(check);
    setQuota(check.quota);
  };

  useEffect(() => {
    checkOnMount();
  }, []);

  return (
    <Container>
      <SearchBarContainer>
        <SearchBar
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuery(e)}
        />
        <SearchBtn
          disabled={quota < 10000 ? false : true}
          onClick={handleSearchBtn}
        />
      </SearchBarContainer>
      <ResultsContainer>
        {results.length !== 0
          ? results.map((item) => {
              return <Item>{item}</Item>;
            })
          : '검색 결과가 없습니다'}
      </ResultsContainer>
    </Container>
  );
};

export default SearchList;
