import { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { playerItems } from '../apis';
import styled from 'styled-components';
import YouTubePlayer from 'youtube-player';
import PlayerList from '../components/PlayerList';
import PlayerChat from '../components/PlayerChat';

const Player = () => {
  const params = useParams();
  const id = parseInt(params.id as string);

  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenedList, setIsOpenedList] = useState<boolean>(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [queue, setQueue] = useState<number>(0);
  const timer = useRef<any>(null);

  const startPlayer = () => {
    player?.playVideo();
  };

  const stopPlayer = () => {
    player?.stopVideo();
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

  const handleListsViewerBtn = () => {
    setIsOpenedList((value) => !value);
  };
  const handleQueue = (index: number) => {
    setQueue((queue) => index);
  };

  useEffect(() => {
    const initPlayer = () => {
      playerItems(id)
        .then((res) => {
          setItems(res.data);
          setPlayer(YouTubePlayer('youtube-player'));
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    };
    initPlayer();
    return () => {
      timer.current = null;
      setItems((items) => []);
      setIsLoading((isLoading) => true);
      setIsOpenedList((isOpenedList) => false);
      setPlayer((player: any) => null);
      setCurrentTime((currentTime) => 0);
      setDuration((duration) => 0);
      setQueue((queue) => 0);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoading) {
      player?.loadVideoById(items[queue].href);
      console.log(items[queue]);
    }
    // eslint-disable-next-line
  }, [queue, isLoading]);

  return (
    <>
      <div>
        <div id='youtube-player'></div>
      </div>
      {!isLoading && items.length > 0 ? (
        <>
          {isOpenedList && (
            <PlayerList
              items={items}
              queue={queue}
              choice={handleQueue}
              close={handleListsViewerBtn}
            />
          )}
          <div>
            {items.length > 0 && (
              <div>
                <p>{items[queue].name}</p>
                <p>
                  <a
                    href={`https://www.youtube.com/channel/${items[queue].uploader_href}`}
                  >
                    {items[queue].uploader}
                  </a>
                </p>
              </div>
            )}
          </div>
          <div>
            <button onClick={startPlayer}>start</button>
            <button onClick={stopPlayer}>stop</button>
            {`${Math.floor(currentTime / 60)} : ${Math.floor(
              currentTime % 60
            )}`}{' '}
            / {`${Math.floor(duration / 60)} : ${Math.floor(duration % 60)}`}
          </div>
          <div>
            <button onClick={handleListsViewerBtn}>open</button>
          </div>
          <PlayerChat />
        </>
      ) : isLoading ? (
        <div>로딩중입니다</div>
      ) : (
        <div>목록이 없습니다</div>
      )}
    </>
  );
};

export default Player;
