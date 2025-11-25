import { NavLink, useNavigate } from 'react-router-dom'
import './NavBar.css'
import Notif from './Notif'
import NotifToggle from './NotifToggle'
import { useAuth } from '../auth/AuthProvider'

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () =>{
    logout();
    navigate('/auth');
  }

  return (
    <nav className="nav">
      <div className="nav-links">
        <div className = "free-nav">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        </div>
        {user &&
          (<div className = "user-nav">
            <NavLink to="/UserProfilePage" className={({ isActive }) => (isActive ? 'active' : '')}>
              Profile
            </NavLink>
            <NavLink to="/VolunteerHistory" className={({ isActive }) => (isActive ? 'active' : '')}>
              Volunteer History
            </NavLink>
          </div>)
        }
        {user &&
        (<div className = "admin-nav">
            <NavLink to="/EventManagement" className={({ isActive }) => (isActive ? 'active' : '')}>
              Event Management
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
              Reports
            </NavLink>
        </div>)
        }
        </div>
      <div className="navbar-right">
        <NotifToggle />
        {user?
          (<button className = "acc-ctrl-btn" onClick = {handleLogout}>Log Out</button>)
          :
          (<NavLink to="/auth" className = "acc-ctrl-btn">
              Sign in
            </NavLink>
          )
        }
      </div>
    </nav>
  )
}

export default NavBar
