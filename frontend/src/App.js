import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import AlertComponent from './AlertComponent';
import LoginSignup from './LoginSignup'
import RouterComponent from './RouterComponent';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress';

function App() {
  let user;
  const [loadingCount, setLoadingCount] = useState(0);
  const [userName, setUserName] = useState();
  const [role, setRole] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [instituition, setInstituition] = useState();
  const [phone, setPhone] = useState();
  const API_URL = "http://localhost:5000";
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(true); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    getUser();
  }, [isLogin]);

  const [title, setTitle] = useState()
  const [message, setMessage] = useState()
  const alertRef = useRef();

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token")
      try {
        if (token) {
          setLoadingCount(prev => prev + 1);
          const verified = await axios.get(API_URL + '/users/verify', {
            headers: { Authorization: token }
          })
          setLoadingCount(prev => prev - 1);
          console.log(verified)
          setIsLogin(verified.data)
          if (verified.data === false) return localStorage.clear()
        } else {
          setIsLogin(false)
        }
      } catch (err) {
        setLoadingCount(prev => prev - 1);
        setTitle("error");
        setMessage("cannot connect to server. try again.");
        alertRef.current.setRefOpen(true)
      }

    }
    setLoading(true);
    checkLogin().then(() => setLoading(false));
  }, [])

  const getUser = async () => {
    try {
      setLoadingCount(prev => prev + 1);
      user = await axios.get(API_URL + `/users/getUser`, {
        headers: { Authorization: token }
      });
      
      user = user.data;
      setUserName(user.username);
      setEmail(user.email);
      setPassword(user.password);
      setInstituition(user.instituition);
      setPhone(user.phone);
      setRole(user.role);
      setLoadingCount(prev => prev - 1);
    } catch (err) {
      setLoadingCount(prev => prev - 1);
      setTitle("error");
      setMessage("cannot connect to server. try again. bruh.");
      alertRef.current.setRefOpen(true)
    }
  }
  return (
    <div className="App">
      <div className="App" id="app">
        <Router>

           {isLogin? <Navbar className='nav' role={role} user={userName}/>:null}
          { !loading ? <div id='components'>
            { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
            {
              isLogin
                ? <RouterComponent setIsLogin={setIsLogin} userName={userName} email={email} password={password} instituition={instituition} role={role} phone={phone} token={token} />
                : <LoginSignup setIsLogin={setIsLogin} />
            }
          </div> : null }
        </Router>
      </div>
      <AlertComponent title={title} message={message} ref={alertRef} />

    </div>
  );
}

export default App;
