import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import UserInfo from './components/UserInfo';
import Groups from './pages/Groups';
import GroupIcons from './components/GroupIcons';

const App = () => {
  return (
    <Router >
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/setAvatar' element={<SetAvatar />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/' element={<Chat />} />
        <Route path='/message/:id' element={<Chat />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/groups' element={<Groups />} />
        <Route path='/groups/1' element={<GroupIcons />} />
        <Route path='/info' element={<UserInfo />} />
      </Routes>
    </Router>
  )
}

export default App