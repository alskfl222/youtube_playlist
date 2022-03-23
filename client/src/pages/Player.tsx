import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlayerItems } from '../apis';
import styled from 'styled-components';
import YouTubePlayer from 'youtube-player';
import PlayerList from '../components/PlayerList';
import PlayerChat from '../components/PlayerChat';

const Player = () => {
  const { state } = useLocation();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenedList, setIsOpenedList] = useState<boolean>(false);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [queue, setQueue] = useState<number>(0);
  const timer = useRef<any>(null);
  const hrefs = Array.isArray(state) ? state.map((el: any) => el.href) : [];

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

  const handleListsViewerBtn = () => {
    setIsOpenedList((value) => !value);
  };
  const handleQueue = (index: number) => {
    setQueue((queue) => index);
  };

  useEffect(() => {
    const initPlayer = async () => {
      const res = await getPlayerItems(hrefs);
      setItems(res.data);
      setPlayer(YouTubePlayer('youtube-player'));
      setIsLoading(false);
    };
    initPlayer();
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
      <div id='youtube-player'></div>
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
        {`${Math.floor(currentTime / 60)} : ${Math.floor(currentTime % 60)}`} /{' '}
        {`${Math.floor(duration / 60)} : ${Math.floor(duration % 60)}`}
      </div>
      <div>
        <button onClick={handleListsViewerBtn}>open</button>
      </div>
      <PlayerChat />
    </>
  );
};

export default Player;
