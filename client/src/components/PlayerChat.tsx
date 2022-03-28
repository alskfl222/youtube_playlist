import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import { playerChatDelete } from '../apis';

const PlayerChat = (props: any) => {
  const { userinfo, playerId } = props;
  const { userId, username } = userinfo;
  const [chat, setChat] = useState<string>('');
  const [chats, setChats] = useState<
    {
      userId: number;
      username: string;
      chat: string;
      addedAt: Date;
    }[]
  >([]);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_API_URL}`, {
      query: [`${playerId}`],
      withCredentials: true,
    });

    socket.current.emit('join', playerId, userId);
    socket.current.once(
      'joinRoom',
      (data: {
        chats: {
          userId: number;
          username: string;
          chat: string;
          addedAt: Date;
        }[];
        message: string;
      }) => {
        console.log(data.chats);
        console.log(data.message);
        setChats((chats) => data.chats);
      }
    );

    socket.current.on(
      'newChat',
      (chat: {
        userId: number;
        username: string;
        chat: string;
        addedAt: Date;
      }) => {
        console.log(chat);
        setChats((befores) => [...befores, chat]);
      }
    );
    socket.current.on('error', (msg: string) => console.log(msg));

    return () => {
      socket.current.disconnect();
    };
  // eslint-disable-next-line
  }, []);

  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat((chat) => e.target.value);
  };

  const sendChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    socket.current.emit('sendChat', playerId, userId, username, chat, () =>
      setChat('')
    );
  };

  const deleteChat = (idx: number) => {
    console.log(chats[idx]);
    playerChatDelete(playerId, chats[idx])
      .then((res) => {
        setChats((chats) => [...chats.slice(0, idx), ...chats.slice(idx + 1)]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {chats.map((chat, idx) => {
        return (
          <p key={`${chat.addedAt}`}>
            {chat.userId} - {chat.username} - {chat.chat} - {chat.addedAt} -{' '}
            <button
              disabled={userId === chat.userId ? false : true}
              onClick={() => deleteChat(idx)}
            >
              delete
            </button>
          </p>
        );
      })}
      <input type='text' onChange={(e) => handleChatInput(e)}></input>
      <button
        disabled={userId !== -1 ? false : true}
        onClick={(e) => sendChat(e)}
      >
        {userId !== -1 ? 'send' : '로그인 후 가능합니다'}
      </button>
    </>
  );
};

export default PlayerChat;
