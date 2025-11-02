
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/Home';
import UserAccount from './pages/UserAccountPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HeaderTemplate from '../src/templates/Header';

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
        </Routes>
      </BrowserRouter>

      
    </>
  )
}

export default App
