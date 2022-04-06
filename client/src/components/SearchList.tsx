import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotaCheck, listSearch, listAdd } from '../apis';
import styled from 'styled-components';
import { Box, TextField } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const SearchBar = styled(Box)`
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border-radius: 1rem;
  background: #fcfcfc;
`;

const SearchTextFieldWrapper = styled(TextField)`
  font-size: 1.5rem;
  & input {
    padding-left: 30px;
  }
`;

const ResultsContainer = styled.div`
  width: 100%;
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
      <SearchBar>
        <SearchTextFieldWrapper
          fullWidth
          variant='standard'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuery(e)}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleEnterToSearch(e)
          }
          inputProps={{ style: { fontSize: '1.5rem' } }}
          sx={{
            width: '70%',
          }}
          placeholder='검색어를 입력하세요'
        />
        <Button
          disabled={quota < 10000 - 100 ? false : true}
          onClick={handleSearchBtn}
          sx={{ borderRadius: '1rem' }}
        >
          <SearchOutlined />
        </Button>
      </SearchBar>
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
