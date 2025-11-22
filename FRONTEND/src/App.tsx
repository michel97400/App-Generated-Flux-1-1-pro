
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/Home';
import UserLayout from './templates/UserLayout';
import Profile from './pages/Profile';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HeaderTemplate from '../src/templates/Header';
import PicsGalery from './pages/PicsUserGalery';
import QuickGeneration from './components/QuickGeneration';
import Settings from './pages/SettingsUsers';

import Chat from './pages/Chat';

function App() {


  return (
    <>
      <BrowserRouter>
      <HeaderTemplate />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Profile />} />
            <Route path="galery" element={<PicsGalery />} />
            <Route path="generation" element={<QuickGeneration />} />
            <Route path="chat" element={<Chat />} />
            <Route path="setting" element={<Settings />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>

      
    </>
  )
}

export default App
