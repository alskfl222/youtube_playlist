import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { playerChatDelete } from '../apis';
import styled from 'styled-components';
import { Delete, Send } from '@mui/icons-material';

const Container = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #fcfcfc;
  border-radius: 1rem;
`;

const ChatsContainer = styled.div`
  width: 100%;
  max-height: 15rem;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden scroll;
`;

const ChatContainer = styled.div`
  align-self: ${(props: { isMine: boolean }) =>
    props.isMine ? 'flex-end' : 'flex-start'};
  max-width: 50%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`;

const ChatStatus = styled.div`
  align-self: ${(props: { isMine: boolean }) =>
    props.isMine ? 'flex-end' : 'flex-start'};
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #333;
  & button:disabled {
    &:hover {
      background-color: #fcfcfc;
      cursor: default;
    }
  }
`;

const ChatContent = styled.div`
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${(props: { isMine: boolean }) =>
    props.isMine ? '#ff9' : '#fcfcfc'};
  box-shadow: 0 1px 10px -1px rgba(0, 0, 0, 0.2);
  text-align: ${(props: { isMine: boolean }) =>
    props.isMine ? 'right' : 'left'};
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 5rem;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1rem 1rem 0 0;
  background-color: #969696;
`;

const InputField = styled.input`
  width: calc(100% - 3rem);
  height: 3rem;
  padding-left: 2rem;
  border: none;
  border-radius: 1rem 0 0 1rem;
  font-size: 1.5rem;
`;

const Divider = styled.div`
  height: 1.5rem;
  border-right: 1px solid #999;
  background-color: #fcfcfc;
`;

const SendBtn = styled.button`
  align-self: flex-end;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fcfcfc;

  &#send-btn {
    border-radius: 0 1rem 1rem 0;
  }
  &:disabled {
    &:hover {
      background-color: #fcfcfc;
      cursor: default;
    }
  }
`;

const PlayerChat = (props: any) => {
  const { userinfo, playerId } = props;
  const { userId, username } = userinfo;
  const [chat, setChat] = useState<string>('');
  const [chats, setChats] = useState<
    {
      userId: number;
      username: string;
      chat: string;
      createdAt: Date;
    }[]
  >([]);
  const socket = useRef<any>(null);
  const inputEl = document.querySelector(
    '#chat-input-field'
  ) as HTMLInputElement;

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
          createdAt: Date;
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
        createdAt: Date;
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
    if (e.target.value.length <= 140) {
      setChat((chat) => e.target.value);
    } else {
      alert('글자수가 너무 많습니다');
      inputEl.value = chat;
    }
  };

  const sendChat = (inputEl: HTMLInputElement) => {
    socket.current.emit('sendChat', playerId, userId, username, chat);
    setChat((chat) => '');
    inputEl.value = '';
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
    <Container>
      <ChatsContainer>
        {chats.map((chat, idx) => {
          const isMine = chat.userId === userId;
          const dateString = chat.createdAt
            .toString()
            .split('T')[0]
            .split('-')
            .join(' - ');
          return (
            <ChatContainer
              isMine={isMine}
              key={`${chat.chat}-${chat.createdAt}`}
            >
              <ChatStatus isMine={isMine}>
                {!isMine && <strong>{chat.username} </strong>}
                {dateString}
                {isMine && (
                  <button disabled={!isMine} onClick={() => deleteChat(idx)}>
                    <Delete sx={{ fontSize: '1.2rem' }} />
                  </button>
                )}
              </ChatStatus>
              <ChatContent isMine={isMine}>{chat.chat}</ChatContent>
            </ChatContainer>
          );
        })}
      </ChatsContainer>
      <InputContainer>
        <InputField
          id='chat-input-field'
          type='text'
          onChange={(e) => handleChatInput(e)}
          onKeyUp={(e) => {
            e.preventDefault();
            if (e.key === 'Enter') {
              sendChat(inputEl);
            }
          }}
        ></InputField>
        <Divider />
        <SendBtn
          id='send-btn'
          disabled={userId !== -1 ? false : true}
          onClick={() => sendChat(inputEl)}
        >
          <Send />
        </SendBtn>
      </InputContainer>
    </Container>
  );
};

export default PlayerChat;
