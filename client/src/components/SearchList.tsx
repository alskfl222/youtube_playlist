import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotaCheck, listSearch, listAdd } from '../apis';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

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
  display: flex;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 1px 1px black;

  img {
    width: 50%;
    max-width: 320px;
    padding: 1rem;
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
  @media screen and (max-width: 480px) {
    flex-direction: column;
  }
`;

const PlaylistDescContainer = styled.div`
  width: 100%;
  padding: 0 1rem;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const PlaylistAddBtn = styled.button`
  padding: 2rem;
  background-color: transparent;
  font-size: 2rem;
`;

const SearchList = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [quota, setQuota] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchBtn = async () => {
    setIsLoading(true);
    const response = await listSearch(query);
    console.log(response);
    setQuota(response.quota);
    setResults(response.data);
    localStorage.setItem('beforeSearch', JSON.stringify(results));
    setIsLoading(false);
  };

  const handlePlaylistAddBtn = async (idx: number) => {
    setIsLoading(true);
    console.log('CLICKED BUTTON');
    const listData = {
      name: results[idx].title,
      href: results[idx].href,
    };
    await listAdd(listData).finally(() => setIsLoading(false));
  };

  const checkOnMount = async () => {
    setIsLoading(true);
    const check = await quotaCheck();
    console.log(check);
    setQuota(check.quota);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem('isLogin') as string))
    if (!JSON.parse(localStorage.getItem('isLogin') as string)) {
      navigate('/login');
      return;
    }
    checkOnMount();
    if (localStorage.getItem('beforeSearch')) {
      setResults(JSON.parse(localStorage.getItem('beforeSearch') as string));
    }
  }, []);

  return (
    <Container>
      <SearchBarContainer>
        <SearchBar
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuery(e)}
        />
        <SearchBtn
          disabled={quota < 10000 - 100 ? false : true}
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
                <img src={item.thumbnail.url} alt={item.title}/>
                <PlaylistDescContainer>
                  <div>
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
                    {item.channelDesc && <p>{item.channelDesc}</p>}
                  </div>
                </PlaylistDescContainer>
                <PlaylistAddBtn onClick={() => handlePlaylistAddBtn(idx)}>
                  <FontAwesomeIcon icon={faCirclePlus} />
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
