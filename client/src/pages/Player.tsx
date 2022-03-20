import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getPlayerItems } from '../apis';
import styled from 'styled-components';

const Player = () => {
  const { state } = useLocation();
  const [items, setItems] = useState<any[]>([]);
  const [queue, setQueue] = useState<number>(0);
  const hrefs = Array.isArray(state) ? state.map((el: any) => el.href) : [];
  const player =
    document.getElementsByTagName('iframe').length > 0
      ? document.getElementsByTagName('iframe')[0].contentWindow
      : null;

  const makePlayer = (songHref: string) => {
    return (
      <iframe
        width='480'
        height='320'
        src={`https://www.youtube.com/embed/${songHref}?autoplay=1&mute=0&enablejsapi=1&version=3&playerapiid=ytplayer`}
        title='YouTube video player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    );
  };
  const startPlayer = (player: HTMLIFrameElement['contentWindow']) => {
    player?.postMessage(
      '{ "event" : "command", "func" : "' + 'playVideo' + '" , "args" : "" }',
      '*'
    );
  };

  const stopPlayer = (player: HTMLIFrameElement['contentWindow']) => {
    player?.postMessage(
      '{ "event" : "command", "func" : "' + 'stopVideo' + '" , "args" : "" }',
      '*'
    );
  };

  useEffect(() => {
    const initPlayer = async () => {
      const res = await getPlayerItems(hrefs);
      await setItems(res.data);
    };
    initPlayer();
    // eslint-disable-next-line
  }, []);

  console.log(items);

  return (
    <>
      {items.length > 0 && makePlayer(items[queue].songHref)}
      <button onClick={() => startPlayer(player)}>start</button>
      <button onClick={() => stopPlayer(player)}>stop</button>
      {items.map((item) => {
        return <div key={item.songHref}>{item.title}</div>;
      })}
    </>
  );
};

export default Player;
