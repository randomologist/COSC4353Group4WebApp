import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from "./pages/UserProfile";
import Home from './pages/Home'
import NavBar from './components/NavBar'

function App(){
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/UserProfilePage" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App


