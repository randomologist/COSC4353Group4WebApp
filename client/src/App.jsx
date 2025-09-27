import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserProfile from "./pages/UserProfile";
import Home from './pages/Home'
import NavBar from './components/NavBar'
import EventManagement from './components/EventManagement'
import VolunteerMatching from './components/VolunteerMatching'
import AuthPage from './pages/AuthPage';

function App(){
  return (
    <BrowserRouter>
      <NavBar />
      <div id="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/UserProfilePage" element={<UserProfile />} />
          <Route path="/EventManagement" element={<EventManagement />} />
          <Route path="/VolunteerMatching" element={<VolunteerMatching />} />
          <Route path="/VolunteerHistory" element={<VolunteerMatching />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App


