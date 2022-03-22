import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const PlayerChat = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(`${process.env.REACT_APP_API_URL}`, {
      withCredentials: true,
    });
    socket.current.on('getBefore', (befores: string[]) => {
      setMessages((messages) => befores);
    });
    socket.current.on('relayMessage', (message: string) => {
      setMessages(befores => [...befores, message])
      console.log(message)
    })
  }, []);

  const handleChatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(message => e.target.value)
  } 

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    socket.current.emit('sendMessage', message, () => setMessage(''))
  };

  return (
    <>
      {messages.map(message => {
        return <p>{message}</p>
      })}
      <input type='text' onChange={(e) => handleChatInput(e)}></input>
      <button onClick={(e) => sendMessage(e)}>send message</button>
    </>
  );
};

export default PlayerChat;
