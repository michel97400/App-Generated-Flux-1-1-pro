
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/Home';
import UserAccount from './pages/UserAccountPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HeaderTemplate from '../src/templates/Header';
import PicsGalery from './pages/PicsUserGalery';
import Galery from './pages/Galery';



function App() {


  return (
    <>
      <BrowserRouter>
      <HeaderTemplate />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/usergalery" element={<PicsGalery />} />
          <Route path="/galery" element={<Galery />} />
        </Routes>
      </BrowserRouter>

      
    </>
  )
}

export default App
