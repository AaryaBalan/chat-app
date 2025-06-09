import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import UserInfo from './components/UserInfo';

const App = () => {
  return (
    <Router >
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setAvatar' element={<SetAvatar />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/' element={<Chat />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/info' element={<UserInfo />} />

      </Routes>
    </Router>
  )
}

export default App