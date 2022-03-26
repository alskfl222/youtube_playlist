import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const PlayerChat = (props: { username: string; playerId: number }) => {
  const { username, playerId } = props;
  const [chat, setChat] = useState<string>('');
  const [chats, setChats] = useState<{ username: string; message: string }[]>(
    []
  );
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_API_URL}`, {
      query: [`${playerId}`],
      withCredentials: true,
    });

    socket.current.emit('join', playerId);
    socket.current.on('joinRoom', (msg: string) => {
      console.log(msg);
    });

    socket.current.on('newChat', (chat: { username: string; message: string }) => {
      console.log(chat);
      setChats((befores) => [...befores, chat]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChat((chat) => e.target.value);
  };

  const sendChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    socket.current.emit('sendChat', chat, playerId, () => setChat(''));
  };

  return (
    <>
      {chats.map((chat) => {
        return <p>{chat.username} {chat.message}</p>;
      })}
      <input type='text' onChange={(e) => handleChatInput(e)}></input>
      <button disabled={username ? false : true} onClick={(e) => sendChat(e)}>
        send chat
      </button>
    </>
  );
};

export default PlayerChat;
