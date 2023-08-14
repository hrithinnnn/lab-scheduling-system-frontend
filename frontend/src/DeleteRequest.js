import React, { useState,useEffect, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
  function DeleteRequest(props, ref) {
    const[open,setOpen] = useState(false);
  const API_URL = "https://lab-scheduling-system-backend.onrender.com";
  const [token,setToken]=useState(props.token);
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
    const [id,setId] = useState('')
  useEffect(()=>{
    setId(props.id);
    setToken(props.token)
    console.log("ID:"+id);
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
   
        
        console.log("id:", id)
        let res= axios.delete(API_URL+`/requests/${id}`,{headers: {Authorization: token}})
        .then(res=>{setSnackbarMessage(res.data.message);
          console.log(snackBarMessage);
                        setSnackbarOpen(true);
                        setTimeout(() => {
                            setSnackbarOpen(false);
                            setSnackbarMessage('')
                        }, 1000);
                        setTimeout(()=>{window.location.reload()},1000)
                      }).catch((err)=>{
        setSnackbarMessage(err.response.data.message);
      console.log(snackBarMessage);
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                        setSnackbarMessage('')
                    }, 1000);
    })};
  

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>delete request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are u sure u want to delete this request?
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
export default forwardRef(DeleteRequest)