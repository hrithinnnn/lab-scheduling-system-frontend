import React, { useState,useRef,useEffect } from "react";
import TestSnackbar from "./TestSnackbar";
import axios from 'axios';
import ChangePassword from "./ChangePassword";
import './updatepassword.css';
import Button from '@mui/material/Button';
import DeleteProfile from "./DeleteProfile";
import LinearProgress from '@mui/material/LinearProgress';
import { roles } from "./Options";
export default function UpdateProfile(props){
  const API_URL = "http://localhost:5000";
  const [loadingCount, setLoadingCount] = useState(0);
  const [token,setToken]=useState(props.token);
  const [userName,setName] = useState(props.userName);
  const [role,setRole] = useState(props.role);
  const [email,setEmail] = useState(props.email);
  const [password,setPassword] = useState(props.password);
  const [instituition,setInstituition] = useState(props.instituition);
  const [phone,setPhone] = useState(props.phone);
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
  const alertRef=useRef();
  const [err,setErr]=useState('');
  useEffect(()=>{
    setToken(props.token)
    setEmail(props.email);
    setName(props.userName);
    setRole(props.role);
    setPassword(props.password);
    setInstituition(props.instituition);
    setPhone(props.phone);
  },[props.email,props.token,props.userName,props.role,props.password,props.instituition,props.phone]);

  const handleNameChange = event => {
        setName(event.target.value);
        setErr('')
    }

    const handleRoleChange = event => {
      setRole(event.target.value);
      setErr('')
  }
  const handleInstituitionChange = event => {
    setInstituition(event.target.value);
    setErr('')
}
const handlePhoneChange = event => {
  setPhone(event.target.value);
  setErr('')
}

const updateProfile = async e => {
  e.preventDefault();
  if(!userName){
    setErr('user name is required')
    return;
}
if(!role){
  setErr('role is required')
  return;
}
if(!instituition){
  setErr('instituition is required')
  return;
}
if(!phone){
  setErr('phone is required')
  return;
}
  try {
          console.log(userName,email,password,role, instituition,phone)
          setLoadingCount(prev => prev + 1);
         let res =  await axios.post(API_URL+`/users/update`, {username:userName,email,password,role, instituition,phone}, {
              headers: {Authorization: token}
          })
          setLoadingCount(prev => prev - 1);
          console.log(res);
          setSnackbarMessage(res.data.message);
          console.log(snackBarMessage);
          setSnackbarOpen(true);
          setTimeout(() => {
              setSnackbarOpen(false);
              setSnackbarMessage('')
          }, 1000);
          
      }
   catch (err) {
    setLoadingCount(prev => prev - 1);
    setSnackbarMessage(err.response.data.message);
    console.log(snackBarMessage);
    setSnackbarOpen(true);
    setTimeout(() => {
        setSnackbarOpen(false);
        setSnackbarMessage('')
    }, 1000);
  }
}


    return(<>
    { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
     <form class="update form">
    <h1>Update Your Profile</h1>
    <span className="label">name: </span> <input
            autoFocus
            margin="dense"
            id="name"
            label="user name"
            type="text"
            variant="standard"
            value={userName}
            onChange={handleNameChange}
          /><br></br>
          <span className="label">email: </span> {`${email}`}<br></br>
    <span className="label">instituition: </span><input
            autoFocus
            margin="dense"
            id="instituition"
            label="instituition"
            type="text"
            variant="text"
            onChange={handleInstituitionChange}
            value={instituition}
            
          /><br></br>
          <span className="label">phone: </span><input
            autoFocus
            margin="dense"
            id="phone"
            label="phone"
            type="number"
            variant="standard"
            onChange={handlePhoneChange}
            value={phone}
            
          /><br></br>

<span className="label">role: </span> <select onChange={handleRoleChange} value={role} id="role"> 
      {roles.map((role) => <option value={role.value}>{role.label}</option>)}
    </select> <br></br>
    <h3 style={{color:'red'}}>{err}</h3>
    <button id="button" class="submit" onClick={updateProfile}>submit</button>
    </form>
    <div><Button id="change-password" variant="outlined" onClick={()=>alertRef.current.setRefOpen(true)}>change Password</Button></div>
    <ChangePassword loading={setLoadingCount} ref={alertRef} email={email} token={token}/> 
    <DeleteProfile loading={setLoadingCount} email={email} token={token} />
    <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
    </>)
}