import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';

function ChangePassword(props, ref) {
 const[email,setEmail]=useState(props.email);
 const setLoadingCount=props.loading;
  const API_URL = "http://localhost:5000";
  const [token,setToken]=useState(props.token);
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [oldPassword, setOldPassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState(false);
  const [newPasswordAgain, setNewPasswordAgain] = React.useState(false);
  const [snackBarMessage, setMessage] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => {
    setEmail(props.email);
    setToken(props.token);
  }, [props.email, props.token]);
  const handleOldPasswordChange = event => {
    setOldPassword(event.target.value);
  }
  const handleNewPasswordChange = event => {
    setNewPassword(event.target.value);
  }
  const handleNewPasswordChangeAgain = event => {
    setNewPasswordAgain(event.target.value);
  }



  useImperativeHandle(ref, () => ({
    setRefOpen(open) {
      setOpen(open);
    }
  }))

  const handleClose = () => {
    setOpen(false);
  };

  const submit = async () => {
    if(newPasswordAgain!==newPassword){
      console.log("bruh")
      setErr('passwords do not match');
      return;
    }
    try {
      console.log(email, oldPassword, newPassword, token)
      setLoadingCount(prev => prev + 1);
      let res = await axios.post(API_URL + `/users/changepassword`, { email, oldPassword, newPassword }, {headers: {Authorization: token}});
      console.log(res);
      setLoadingCount(prev => prev - 1);
      console.log(res.data.message)
      setMessage(res.data.message);
      console.log(snackBarMessage);
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage('')
      }, 1000);
      setTimeout(()=>{window.location.reload()},1000);
    } catch (err) {
      setLoadingCount(prev => prev - 1);
      console.log(err.response.data.message)
      setMessage(err.response.data.message);
      console.log(snackBarMessage);
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setMessage('')
      }, 1000);
    }
  }

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>change password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            re-enter old password, then enter new password twice.
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
            id="password"
            label="old password"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleOldPasswordChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="new password"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleNewPasswordChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="new password again"
            type="password"
            fullWidth
            variant="standard"
            onChange={handleNewPasswordChangeAgain}
          />

      <h3 style={{color:'red'}}>{err}</h3>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submit}>Change password</Button>
        </DialogActions>
      </Dialog>
      <TestSnackbar message={snackBarMessage} bool={openSnackbar} />
    </div>
  );
}

export default React.forwardRef(ChangePassword)