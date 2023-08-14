import React, { useState,useEffect, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
import {sendEmail,sendDeniedEmail} from './SendEmail';
  function DeleteLab(props, ref) {
  const API_URL = "https://lab-scheduling-system-backend.onrender.com";
  const [token,setToken]=useState(props.token);
  const[open,setOpen] = useState(false);
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
    const [id,setId] = useState('')
    const [status,setStatus] = useState('')
    const [message,setPromptMessage] = useState('')
    const [user,setUser]=useState(props.user);
    const[date,setDate]=useState(props.date);
    const [labName,setLabName]=useState(props.lab);
    const [start,setStart]=useState(props.start);
    const [end,setEnd]=useState(props.end);
    const [title,setTitle] = useState(props.title);
    const [description,setDescription]=useState(props.description);
    const [email,setEmail]=useState(props.email);
    const [labIncharge,setLabIncharge]=useState(props.labIncharge);
    const [type,setType]=useState(props.type);
    const [approve,setApprove] = useState(props.approvedBy);
    const [reject,setReject]=useState(props.rejectedBy);
    const setLoadingCount=props.loading;
  useEffect(()=>{
    setId(props.id);
    setStatus(props.status);
    setUser(props.user);
    setToken(props.token)
    setStart(props.start);
    setEnd(props.end);
    setDate(props.date);
    setLabName(props.lab);
    setTitle(props.title);
    setDescription(props.description)
    setEmail(props.email);
    setLabIncharge(props.labIncharge)
    setType(props.type)
   setApprove(props.approvedBy);
   setReject(props.rejectedBy);
    console.log("props:", props)

  },[props.id,props.status ,props.token,props.start,props.end,props.lab,props.date,props.title,props.desc,props.labName,props.labincharge,props.email,props.rejectedBy,props.approvedBy]);

  useEffect(()=>{
    if(status==1){
      setPromptMessage("approve")
    }
    else{
      setPromptMessage("deny")
    }
    console.log(message)
  },[status])


  useImperativeHandle(ref, () => ({
    setRefOpen(open) {
      setOpen(open);
    }
  }))
  const handleClose = () => {
    setOpen(false);
  };

  
  const approveOrDeny = async () => {
    try {
      setLoadingCount(prev => prev + 1);
           let res =  await axios.post(API_URL+`/requests/lab/${id}/${status}/${user}`, {}, {
                headers: {Authorization: token}
            })
            setLoadingCount(prev => prev - 1);
            setSnackbarMessage(res.data.message);
            console.log(snackBarMessage);
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
                setSnackbarMessage('')
            }, 1000);
            let labMessage;
            if(status==1){
              labMessage=`approved by ${approve}`
              sendEmail(email,title,description,labName,date.split('T')[0],start,end,labMessage, user,"pending","Lab Incharge")

            }

              else{
                labMessage=`rejected by ${reject}`
              
              sendDeniedEmail(email,title,description,labName,date.split('T')[0],start,end,labMessage,user,"pending","Lab Incharge")
            }
        }
     catch (err) {
      setLoadingCount(prev => prev - 1);
      setSnackbarMessage( err.response.data.message);
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
        <DialogTitle>{message} request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            are u sure u want to {message} request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={approveOrDeny}>{message}</Button>
        </DialogActions>
      </Dialog>
      <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
    </div>
  );
}

export default forwardRef(DeleteLab)