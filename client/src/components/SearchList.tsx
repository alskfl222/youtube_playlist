import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quotaCheck, listSearch, listAdd } from '../apis';
import styled from 'styled-components';
import { Add, Search } from '@mui/icons-material';

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 4rem);
  margin-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: hidden;
`;

const SearchBarContainer = styled.div`
  width: 100%;
  height: 5rem;
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #fcfcfc;
`;

const SearchBar = styled.input`
  flex: 1 0 auto;
  width: 70%;
  min-width: 240px;
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
  flex: 0 0 auto;
  width: 3rem;
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
const QuotaViewerContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    transform: rotate(-90deg);
  }
  div {
    position: absolute;
    text-align: center;
    line-height: 48px;
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
  min-width: 320px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-radius: 12px;
  box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  img {
    display: none;
    width: 30%;
    max-width: 270px;
    border-radius: 6px;
  }
  &:hover {
    transform: translateY(-3px);
  }
  @media (min-width: 768px) {
    flex-direction: row;
    img {
      display: inline;
    }
  }
`;

const PlaylistDescContainer = styled.div`
  width: 100%;
  padding: 0 4rem 0 1rem;
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
  @media (min-width: 768px) {
    width: 70%;
    padding: 0 8rem 0 1rem;
  }
`;

const PlaylistAddBtn = styled.button`
  position: absolute;
  top: calc(50% - 2rem);
  right: 2rem;
  width: 1rem;
  height: 1rem;
  z-index: 100;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #cfc;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #9f9;
  }
  @media (min-width: 768px) {
    width: 2rem;
    height: 2rem;
    padding: 2rem;
    border-radius: 1rem;
  }
`;

const SearchList = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [quota, setQuota] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const MAX_QUOTA: number = 10000 - 100;
  const QUOTA_PROGRESS_WIDTH = 48;
  const QUOTA_PROGRESS_STROKE = QUOTA_PROGRESS_WIDTH / 4;
  const QUOTA_PROGRESS_RADIUS =
    QUOTA_PROGRESS_WIDTH / 2 - QUOTA_PROGRESS_STROKE / 2;

  const getProgressOffset = (quota: number): number => {
    const progress =
      Math.round((quota / MAX_QUOTA + Number.EPSILON) * 100) / 100;
    const totalCircle = 2 * Math.PI * QUOTA_PROGRESS_RADIUS;
    return totalCircle * (1 - progress);
  };

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
      thumbnail: results[idx].thumbnail.url,
    };
    await listAdd(listData).finally(() => setIsLoading(false));
  };

  const checkOnMount = async () => {
    setIsLoading(true);
    try {
      const check = await quotaCheck();
      console.log(check);
      setQuota(check.quota);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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
          disabled={quota < MAX_QUOTA ? false : true}
          onClick={handleSearchBtn}
        >
          {quota < MAX_QUOTA && (
            <Search sx={{ color: 'white', fontSize: '2rem' }} />
          )}
        </SearchBtn>
        <QuotaViewerContainer>
          <svg width={QUOTA_PROGRESS_WIDTH} height={QUOTA_PROGRESS_WIDTH}>
            <circle
              cx={QUOTA_PROGRESS_WIDTH / 2}
              cy={QUOTA_PROGRESS_WIDTH / 2}
              r={QUOTA_PROGRESS_RADIUS}
              stroke='#aaa'
              strokeWidth={QUOTA_PROGRESS_STROKE}
              fill='none'
            />
            <circle
              cx={QUOTA_PROGRESS_WIDTH / 2}
              cy={QUOTA_PROGRESS_WIDTH / 2}
              r={QUOTA_PROGRESS_RADIUS}
              stroke='#0c0'
              strokeWidth={QUOTA_PROGRESS_STROKE}
              strokeDasharray={2 * Math.PI * QUOTA_PROGRESS_RADIUS}
              strokeDashoffset={getProgressOffset(quota)}
              strokeLinecap='round'
              fill='none'
            />
          </svg>
          <div>
            {`${Math.round((quota / MAX_QUOTA + Number.EPSILON) * 100)}%`}
          </div>
        </QuotaViewerContainer>
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