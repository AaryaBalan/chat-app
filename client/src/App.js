import React, { useRef, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import UserInfo from './components/UserInfo';
import Groups from './pages/Groups';
import { io } from 'socket.io-client';

const App = () => {
  const socketRef = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser?._id) return;

    const serverHost = window.location.hostname;
    const socketServerURL = `http://${serverHost}:5000`;
    socketRef.current = io(socketServerURL);

    const socket = socketRef.current;

    const handleConnection = () => {
      socket.emit('online', currentUser._id);
      socket.emit('addUser', currentUser._id);
    };

    handleConnection();

    socket.on('online', (users) => setOnlineUsers(users));
    socket.on('connect', handleConnection); // reconnect logic

    setIsLoaded(true);

    return () => {
      socket.disconnect(); // clean up
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        {isLoaded && (
          <>
            <Route path='/setAvatar' element={<SetAvatar />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/' element={<Chat socketRef={socketRef} onlineUsers={onlineUsers} isLoaded={isLoaded} />} />
            <Route path='/message/:id' element={<Chat />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/groups' element={<Groups socketRef={socketRef} />} />
            <Route path='/groups/:id' element={<Groups socketRef={socketRef} />} />
            <Route path='/info' element={<UserInfo />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
