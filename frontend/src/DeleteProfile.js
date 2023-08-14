import React, { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
export default function DeleteProfile(props) {
  const setLoadingCount=props.loading;
  const [email, setEmail] = useState(props.email);
  const [token, setToken] = useState(props.token);
  const API_URL = "http://localhost:5000";
  const [err, setErr] = useState('')
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
  const [confirmation,setConfirmation]=useState();
  const[open,setOpen] = useState(false);
  useEffect(()=>{
    setEmail(props.email);
    setToken(props.token);
    console.log(email,token)
  },[props.email,props.token])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleinputChange = e => {
    setConfirmation(e.target.value);
    setErr('')
}
  const submit= async()=>{
    if(confirmation!=="delete"){
      setErr('type "delete" to delete')
      return;
    }
    try{
      setLoadingCount(prev => prev + 1);
        console.log(email)
        let res= await axios.delete(API_URL+`/users/delete/${email}`,{headers: {Authorization: token}});
        console.log(res)
        setLoadingCount(prev => prev - 1);
        setSnackbarMessage(res.data.message);
          console.log(snackBarMessage);
                        setSnackbarOpen(true);
                        setTimeout(() => {
                            setSnackbarOpen(false);
                            setSnackbarMessage('')
                        }, 1000);
                        localStorage.removeItem("token");
                        window.location.href = '/';
    } catch(err){
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

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        delete profile
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>delete profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            type "delete" to delete profile.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            defaultValue={email}
            inputProps={
              { readOnly: true, }}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="delete"
            type="text"
            fullWidth
            onChange={handleinputChange}
            variant="standard"
          />
          <h3 style={{color:'red'}}>{err}</h3>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submit}>delete</Button>
        </DialogActions>
      </Dialog>
      <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
    </div>
  );
}