import { useEffect, useState } from 'react';
import { checkQuota, searchList, addList } from '../apis';
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border: 1px solid black;
`;

const ResultsMsg = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const PlaylistContainer = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 1px 1px black;

  img {
    height: 200px;
    padding: 0 1rem;
  }
  a {
    text-decoration: none;
    color: black;
  }
  h4,
  h5 {
    margin: 0;
  }
  p {
    word-break: keep-all;
  }
  button {
    border: none;
  }
`;

const PlaylistDescContainer = styled.div`
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PlaylistAddBtn = styled.button`
  width: 6rem;
  margin: 0 1rem;
  padding: 1rem;
`;

const SearchList = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [quota, setQuota] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSearchBtn = async () => {
    setIsLoading(true)
    const response = await searchList(query);
    console.log(response);
    setQuota(response.quota);
    setResults(response.data);
    setIsLoading(false)
  };

  const handlePlaylistAddBtn = async (idx: number) => {
    setIsLoading(true)
    console.log("CLICKED BUTTON")
    const listData = {
      name: results[idx].title,
      href: results[idx].href,
    }
    const response = await addList(listData)
    console.log(response)
    setIsLoading(false)
  }

  const checkOnMount = async () => {
    setIsLoading(true)
    const check = await checkQuota();
    console.log(check);
    setQuota(check.quota);
    setIsLoading(false)
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
        {isLoading ? (
          <ResultsMsg>불러오는 중입니다</ResultsMsg>
        ) : results && results.length !== 0 ? (
          results.map((item, idx) => {
            return (
              <PlaylistContainer key={item.title}>
                <img src={item.thumbnail.url} />
                <PlaylistDescContainer>
                  <h4>
                    <a
                      href={`https://www.youtube.com/playlist?list=${item.href}`}
                    >
                      {item.title}
                    </a>
                  </h4>
                  <h5>
                    <a
                      href={`https://www.youtube.com/channel/${item.channelHref}`}
                    >
                      {item.channelTitle}
                    </a>
                  </h5>
                  <p>{item.channelDesc}</p>
                </PlaylistDescContainer>
                <PlaylistAddBtn onClick={() => handlePlaylistAddBtn(idx)}>
                  목록
                  <br />
                  추가
                </PlaylistAddBtn>
              </PlaylistContainer>
            );
          })
        ) : (
          <ResultsMsg>검색 결과가 없습니다</ResultsMsg>
        )}
      </ResultsContainer>
    </Container>
  );
};

export default SearchList;
