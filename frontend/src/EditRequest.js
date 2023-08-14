import React, { useState,useEffect, useImperativeHandle} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
import { events } from './Options';

function EditRequest(props, ref) {
  const API_URL = "http://localhost:5000";
  const[token,setToken] = useState(props.token)
  const [err, setErr] = useState('')
    const [title,setTitle]=useState(props.title);
    const [description,setDescription]=useState(props.desc);
    const [date,setDate]=useState(props.date);
    const [start,setStart]=useState(props.starttime);
    const [end,setEnd]=useState(props.endtime);
    const [Id,setId]=useState(props.id);
    const [event,setEventName]=useState(props.type);
    const [labName,setLabName]=useState(props.venue);
    const [open, setOpen] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    


const handleEventNameChange = e => {
  setEventName(e.target.value);
  setErr('')
}
const handleTitleChange = event => {
  setTitle(event.target.value);
  setErr('')
}
const handleDescChange = event => {
  setDescription(event.target.value);
  setErr('')
}


  useImperativeHandle(ref, () => ({
    setRefOpen(open) {
      console.log("props", props)
      setOpen(open);
    }
  }))

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    setTitle(props.title);
    setId(props.id);
    setDescription(props.desc);
    setStart(props.starttime);
    setEnd(props.endtime);
    setDate(props.date);
    setLabName(props.venue);
    setEventName(props.type)
    setToken(props.token);
    console.log(props.token)
  },[props.title,props.id,props.desc,props.starttime,props.endtime, props.date,props.venue,props.type,props.token])

  const submit = async () =>{
    if(!title){
      setErr('title is required')
      return;
  }
  if(!description){
      setErr('description is required')
      return;
  }
    if(!event){
      setErr('type of event is required')
      return;
  }

    try{
      let res= await axios.post(API_URL+`/requests/${Id}`,{title,description,eventType:event},{headers: {Authorization: token}});
      console.log(res);
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
      <Dialog open={open}>
        <DialogContent>
          <h1>Edit request</h1>
   
   event name: <select onChange={handleEventNameChange} value={event}> 
     {events.map((event) => <option value={event.value}>{event.label}</option>)}
   </select> <br></br>

   title: <input value={title} type="text" id="title" name="title" onChange={handleTitleChange} /><br></br>
   description: <textarea value={description} type="text" id="description" name="description" onChange={handleDescChange} /> <br></br>
   <h3 style={{color:'red'}}>{err}</h3>
   labName: {props.venue} <br></br>
   date: {props.date.split('T')[0]} <br></br>
   starting time: {props.starttime}<br></br>
   ending time: {props.endtime} <br></br>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submit}>save</Button>
        </DialogActions>
      </Dialog>
      <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
    </div>
  );
}


export default React.forwardRef(EditRequest)