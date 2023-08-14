import React, { useState,useEffect, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
  function DeleteLab(props, ref) {
  const API_URL = "https://lab-scheduling-system-backend.onrender.com";
  const [token,setToken] = useState(props.token);
  const[open,setOpen] = useState(false);
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    const [id,setId] = useState('')
  useEffect(()=>{
    setId(props.id);
    setToken(props.token);
  },[props.id,props.token])


  useImperativeHandle(ref, () => ({
    setRefOpen(open) {
      setOpen(open);
    }
  }))
  const handleClose = () => {
    setOpen(false);
  };

  const submit= async()=>{
    try{

        console.log("id:", id)
        let res= await axios.delete(API_URL+`/lab/${id}`,{headers: {Authorization: token}});
        console.log(res)
        setSnackbarMessage(res.data.message);
          console.log(snackBarMessage);
                        setSnackbarOpen(true);
                        setTimeout(() => {
                            setSnackbarOpen(false);
                            setSnackbarMessage('')
                        }, 1000);
                        setTimeout(()=>{window.location.reload()},1000)
    } catch(err){
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>delete lab</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are u sure u want to delete this lab class?
          </DialogContentText>
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

export default forwardRef(DeleteLab)