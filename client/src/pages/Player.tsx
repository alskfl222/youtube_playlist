import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlayerItems } from '../apis';
import styled from 'styled-components';
import YouTubePlayer from 'youtube-player';

const Player = () => {
  const { state } = useLocation();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<any>(null);
  const [status, setStatus] = useState<object>({});
  const [queue, setQueue] = useState<number>(0);
  const hrefs = Array.isArray(state) ? state.map((el: any) => el.href) : [];

  const startPlayer = () => {
    player?.playVideo();
  };

  const stopPlayer = () => {
    player?.stopVideo();
  };

  useEffect(() => {
    const initPlayer = async () => {
      const res = await getPlayerItems(hrefs);
      await setItems(res.data);
      await setPlayer(YouTubePlayer('youtube-player'));
      await setIsLoading(false);
    };
    initPlayer();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isLoading) {
      player?.loadVideoById(items[queue].songHref);
      player?.on('stateChange', async (event: any) => {
        if (event.data === 0) {
          setQueue(queue + 1);
        }
      });
    }
    // eslint-disable-next-line
  }, [queue, isLoading]);

  return (
    <>
      <div id='youtube-player'></div>
      <button onClick={startPlayer}>start</button>
      <button onClick={stopPlayer}>stop</button>
      {items.map((item) => {
        return <div key={item.songHref}>{item.title}</div>;
      })}
    </>
  );
};

export default Player;
