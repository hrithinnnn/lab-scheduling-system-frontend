import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import HamburgerMenu from './HamburgerMenu';

export default function Navbar(props) {
  const role = props.role;
  const user = props.user;
  const logoutSubmit = () => {
    localStorage.removeItem("token")
    console.log(localStorage.getItem("token"))
    window.location.href = '/';
  }


  return (

    <header>
      <ul>
        <div id="item-left">
          <li><Link><HamburgerMenu role={role} user={user} /></Link></li>
        </div>
        <div class="dropdown">

          <button class="dropbtn"> <div id="item">{`${user}`} <i class="arrow down"></i></div>
            <i class="fa fa-caret-down"></i>
          </button>
          <div class="dropdown-content">
            <Link to='/updateprofile'>update profile</Link>
            <Link onClick={() => logoutSubmit()}>logout</Link>
          </div>
        </div>
        <li><Link to="/search" ><div id="item">search </div></Link></li>
        {role==='Lab Incharge'||role==='Admin'?<li><Link to="/scheduleLabClasses"><div id="item">schedule lab</div></Link></li>:null}
        <li><Link to="/create"><div id="item">create request</div></Link></li>
        <li id="item"><Link to="/"><div id="item">Schedules</div></Link></li>


      </ul>
    </header>
  )


}
