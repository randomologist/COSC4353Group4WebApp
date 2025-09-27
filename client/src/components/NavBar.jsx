import { NavLink } from 'react-router-dom'
import './NavBar.css'
import Notif from './Notif'
import NotifToggle from './NotifToggle'

function NavBar() {
  return (
    <nav className="nav">
      <div className="nav-links">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/UserProfilePage" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
        <NavLink to="/EventManagement" className={({ isActive }) => (isActive ? 'active' : '')}>
          Event Management
        </NavLink>
        <NavLink to="/VolunteerMatching" className={({ isActive }) => (isActive ? 'active' : '')}>
          Volunteer Matching
        </NavLink>
        <NavLink to="/auth" className={({ isActive }) => (isActive ? 'active' : '')}>
          Sign in
        </NavLink>
      </div>
      <div className="navbar-right">
        <NotifToggle />
      </div>
    </nav>
  )
}

export default NavBar
