import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { playerItems } from '../apis';
import { padStart, throttle } from 'lodash';
import YouTubePlayer from 'youtube-player';
import PlayerList from '../components/PlayerList';
import PlayerChat from '../components/PlayerChat';
import styled from 'styled-components';
import {
  ArrowBack,
  List,
  HourglassEmptyOutlined,
  ChatBubbleOutline,
  PlayCircleFilled,
  PauseCircleFilled,
  SkipNext,
} from '@mui/icons-material';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  button {
    border: none;
    border-radius: 0.5rem;
    background: #fcfcfc;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
`;

const PlayerContainer = styled.div`
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
`;

const PlayerStatusContainer = styled.div`
  padding: 1rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const PlayerControllerBar = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerControllerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const ControllerBtn = styled.button`
  width: 3rem;
  height: 3rem;
`;

const ControllerClock = styled.div`
  width: 15rem;
  height: 3rem;
  padding: 0 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fcfcfc;
`;

const SonginfoContainer = styled.div`
  width: 100%;
  height: 4rem;
  padding: 1rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  background-color: #fcfcfc;
`;

const SongTitle = styled.p`
  width: 70%;
  font-weight: 700;
  white-space: nowrap;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongUploader = styled.p`
  width: 30%;
  text-align: right;

  a {
    color: black;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    word-break: keep-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const PlayerTab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const TabBtn = styled.button`
  width: 100%;
  height: 3rem;
  border: none;
  background-color: #fcfcfc;
`;

const Player = () => {
  const params = useParams();
  const id = parseInt(params.id as string);
  const location = useLocation();
  const state: { userId: number; username: string } | any = location.state;
  const navigate = useNavigate();

  const [userinfo, setUserinfo] = useState<
    { userId: number; username: string } | any
  >('');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<string>('chat');
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [queue, setQueue] = useState<number>(0);
  const timer = useRef<any>(null);

  const startPlayer = () => {
    player?.playVideo();
  };

  const pausePlayer = () => {
    player?.pauseVideo();
  };

  const skipPlayer = () => {
    setQueue((queue) => queue + 1);
  };

  const startTimer = () => {
    setCurrentTime((currentTime) => currentTime + 1);
  };

  player?.on('stateChange', async (event: any) => {
    if (event.data === 0) {
      if (timer.current !== null) {
        clearInterval(timer.current);
        timer.current = null;
      }
      setCurrentTime((currentTime) => 0);
      setDuration((duration) => 0);
      setQueue((queue) => queue + 1);
    }
    if (event.data === 1) {
      const newCurrentTime = (await player?.getCurrentTime()) as number;
      setCurrentTime((currentTime) => newCurrentTime);
      if (timer.current !== null) {
        clearInterval(timer.current);
        timer.current = null;
      }
      timer.current = setInterval(startTimer, 1000);
      if (duration === 0) {
        setTimeout(async () => {
          const newDuration = await player?.getDuration();
          setDuration((duration) => newDuration);
        }, 2000);
      }
    }
    if (event.data === 2 || event.data === 3 || event.data === 5) {
      if (timer.current !== null) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  });

  player?.on('error', async (event: any) => {
    switch (event.data) {
      case 2:
        console.log('Invalid VideoId');
        setQueue((queue) => queue + 1);
        break;
      case 5:
        console.log('Not Playable');
        setQueue((queue) => queue + 1);
        break;
      case 100:
        console.log('Not Found');
        setQueue((queue) => queue + 1);
        break;
      case 101:
        console.log('Not Allowed to Embedded');
        setQueue((queue) => queue + 1);
        break;
      case 150:
        console.log('Not Allowed to Embedded 2');
        setQueue((queue) => queue + 1);
        break;
      default:
        console.log(event.data);
        setQueue((queue) => queue + 1);
    }
  });

  const handleTab = (tab: string): void => {
    setTab((state) => tab);
  };
  const handleQueue = (index: number) => {
    setQueue((queue) => index);
  };

  const getWindowWidth = () => {
    const { innerWidth: width } = window;
    return width;
  };

  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    if (!state) {
      navigate('/lists');
    } else {
      setUserinfo((userinfo: any) => state);
    }
    const initPlayer = () => {
      playerItems(id)
        .then((res) => {
          setItems((items) => res.data);
          setPlayer(YouTubePlayer('youtube-player'));
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    };
    initPlayer();

    const handleResize = () => {
      setWindowWidth((width) => getWindowWidth());
    };
    window.addEventListener('resize', throttle(handleResize, 500));

    return () => {
      timer.current = null;
      setItems((items) => []);
      setIsLoading((isLoading) => true);
      setTab((tab) => 'chat');
      setPlayer((player: any) => null);
      setCurrentTime((currentTime) => 0);
      setDuration((duration) => 0);
      setQueue((queue) => 0);
      window.removeEventListener('resize', throttle(handleResize, 500));
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (windowWidth < 320 + 32) {
      player?.setSize(320, 180);
    } else if (windowWidth < 960 + 32) {
      player?.setSize(windowWidth - 32, ((windowWidth - 32) / 16) * 9);
    } else {
      player?.setSize(960, 540);
    }
  }, [player, windowWidth]);

  useEffect(() => {
    if (!isLoading) {
      player?.loadVideoById(items[queue].href);
      console.log(items[queue]);
    }
    // eslint-disable-next-line
  }, [queue, isLoading]);

  return (
    <Container>
      <PlayerContainer>
        <div id='youtube-player'></div>
      </PlayerContainer>
      {!isLoading && items.length > 0 ? (
        <PlayerStatusContainer>
          {false && (
            <PlayerList
              items={items}
              queue={queue}
              choice={handleQueue}
              close={() => handleTab('chat')}
            />
          )}

          {items.length > 0 && (
            <SonginfoContainer>
              <SongTitle>{items[queue].name}</SongTitle>
              <SongUploader>
                <a
                  href={`https://www.youtube.com/channel/${items[queue].uploader_href}`}
                >
                  {items[queue].uploader}
                </a>
              </SongUploader>
            </SonginfoContainer>
          )}

          <PlayerControllerBar>
            <ControllerBtn onClick={() => navigate('/lists')}>
              <ArrowBack />
            </ControllerBtn>
            <PlayerControllerContainer>
              <ControllerBtn onClick={startPlayer}>
                <PlayCircleFilled />
              </ControllerBtn>
              <ControllerBtn onClick={pausePlayer}>
                <PauseCircleFilled />
              </ControllerBtn>
              <ControllerBtn onClick={skipPlayer}>
                <SkipNext />
              </ControllerBtn>
              <ControllerClock>
                {`${Math.floor(currentTime / 60)} : ${padStart(
                  Math.floor(currentTime % 60).toString(),
                  2,
                  '0'
                )}`}{' '}
                /{' '}
                {duration !== 0 ? (
                  `${Math.floor(duration / 60)} : ${padStart(
                    Math.floor(duration % 60).toString(),
                    2,
                    '0'
                  )}`
                ) : (
                  <HourglassEmptyOutlined />
                )}
              </ControllerClock>
            </PlayerControllerContainer>
          </PlayerControllerBar>
          <PlayerTab>
            <TabBtn onClick={() => handleTab('list')}>
              <List />
            </TabBtn>
            <TabBtn onClick={() => handleTab('chat')}>
              <ChatBubbleOutline />
            </TabBtn>
          </PlayerTab>
          <PlayerChat userinfo={userinfo} playerId={Number(id)} />
          <PlayerList
            items={items}
            queue={queue}
            choice={handleQueue}
            isOpen={tab === 'list'}
            close={() => handleTab('chat')}
          />
        </PlayerStatusContainer>
      ) : isLoading ? (
        <div>로딩중입니다</div>
      ) : (
        <div>목록이 없습니다</div>
      )}
    </Container>
  );
};

export default Player;
