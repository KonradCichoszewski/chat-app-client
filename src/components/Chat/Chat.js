import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;
let counter = 1;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, () => {

    });

    counter++;

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
      console.log(messages);
    })
  }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();
    counter++;

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      console.log('this is the message:' + message);
      console.log("You were here!");
    }
  }

  console.log(counter, message, messages);

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room}></InfoBar>
        <Messages messages={messages} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default Chat;