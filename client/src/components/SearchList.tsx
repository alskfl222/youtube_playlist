import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotaCheck, listSearch, listAdd } from '../apis';
import styled from 'styled-components';
import { Add, Search } from '@mui/icons-material';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchBarContainer = styled.div`
  width: 100%;
  height: 5rem;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background-color: #fcfcfc;
`;

const SearchBar = styled.input`
  width: 70%;
  min-width: 300px;
  height: 48px;
  padding: 0 2rem;
  font-size: 1.5rem;
  border: none;
  border-bottom: 1px solid black;

  &:focus {
    outline: none;
    border-bottom: 1.5px solid #9999ff;
  }
`;

const SearchBtn = styled.button`
  width: 4rem;
  height: 3rem;
  background-color: coral;
  border: none;
  border-radius: 24px;
  cursor: pointer;

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #fcfcfc;
`;

const ResultsMsg = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const PlaylistContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 12px;
  box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;

  img {
    width: 30%;
    max-width: 270px;
    border-radius: 6px;
  }
  &:hover {
    transform: translateY(-6px);
  }
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PlaylistDescContainer = styled.div`
  position: relative;
  width: 70%;
  height: fit-content;
  padding: 0 6rem 0 1rem;
  
  a {
    text-decoration: none;
    color: black;
  }
  h4,
  h5 {
    margin: 0;
    white-space: nowrap;
    word-break: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    word-break: keep-all;
  }

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const PlaylistAddBtn = styled.button`
  position: absolute;
  top: calc(50% - 2rem);
  right: 1rem;
  width: 2rem;
  height: 2rem;
  z-index: 10;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccffcc;
  border: none;
  border-radius: 1rem;
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

  const handleSearchBtn = () => {
    setIsLoading(true);
    listSearch(query)
      .then((res) => {
        console.log(res);
        setQuota((quota) => res.quota);
        setResults((results) => res.data);
        localStorage.setItem('beforeSearch', JSON.stringify(res.data));
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleEnterToSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchBtn();
    }
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
    console.log(JSON.parse(localStorage.getItem('isLogin') as string));
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
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleEnterToSearch(e)
          }
        />
        <SearchBtn
          disabled={quota < 10000 - 100 ? false : true}
          onClick={handleSearchBtn}
        >
          {quota < 10000 - 100 && (
            <Search sx={{ color: 'white', fontSize: '2rem' }} />
          )}
        </SearchBtn>
      </SearchBarContainer>
      <ResultsContainer>
        {isLoading ? (
          <ResultsMsg>불러오는 중입니다</ResultsMsg>
        ) : results && results.length !== 0 ? (
          results.map((item, idx) => {
            return (
              <PlaylistContainer key={item.href}>
                <img src={item.thumbnail.url} alt={item.title} />
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
                  <PlaylistAddBtn onClick={() => handlePlaylistAddBtn(idx)}>
                    <Add sx={{ fontSize: '2rem' }} />
                  </PlaylistAddBtn>
                </PlaylistDescContainer>
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
