import React, { useState,useEffect, useImperativeHandle, forwardRef,useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import TestSnackbar from './TestSnackbar';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import CheckAvailabilityResponse from './CheckAvailabilityResponse';
import { labs } from './Options';

function CheckAvailability(props, ref) {
  const [data,setData]=useState([]);
  const responseRef=useRef();
  const API_URL = "http://localhost:5000";
  const[token,setToken] = useState(props.token)
  const [err, setErr] = useState('')
    const [date,setDate]=useState();
    const [start,setStart]=useState();
    const [end,setEnd]=useState();
    const [labName,setLabName]=useState("JTL");
    const [open, setOpen] = React.useState(false);
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    const setLoadingCount=props.loading;

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleStartTimeChange = (time) => {
        setStart(time["$H"]+":"+time["$m"])
        setErr('')
      };
      const handleEndTimeChange = (time) => {
          setEnd(time["$H"]+":"+time["$m"])
          console.log("start" , end)
          setErr('')
};


const handlelabNameChange = event => {
  setLabName(event.target.value);
  console.log(labName)
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
    setToken(props.token);
    console.log(props.token)
  },[props.token])


  const submit = async () =>{
    if(!date){
      setErr("please enter date")
      return;
    }
    if(!labName){
      setErr("please enter lab name")
      return;
    }
    if(!start){
      setErr("please enter starting time")
      return;
    }
    if(!end){
      setErr("please enter ending time")
      return;
    }
    if(date&&labName&&start&&end){
    try{
      setLoadingCount(prev => prev + 1);
      let res= await axios.get(API_URL+`/requests/check/${date}/${labName}/${start}/${end}`,{headers: {Authorization: token}});
      console.log("res: ",res);
      setData(res.data.clashingitems);
      setLoadingCount(prev => prev - 1);
      responseRef.current.setRefMessage(":hello")
      responseRef.current.setRefData(res.data.clashingitems);
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
}
  

  return (
    <div>

      <CheckAvailabilityResponse venue={labName} date={date} starttime={start} endtime={end} ref={responseRef} token={token}/>

<Button variant="outlined" onClick={handleClickOpen}>
        check lab availability
      </Button>
      <Dialog open={open}>
        <DialogContent>

          <h1>Check Availability</h1>
   
       labName: <select onChange={handlelabNameChange} value={labName}> 
      {labs.map((lab) => <option value={lab.value}>{lab.label}</option>)}
    </select> <br></br>
date:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker selected={date} onChange={date => setDate(String(date["$M"]+1)+'-'+String(date["$D"])+'-'+date["$y"])}/>
    </LocalizationProvider> <br></br>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleStartTimeChange}
          label="select start time" 
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
        />
        </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleEndTimeChange}
          label="select ending time"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />{end}

        </LocalizationProvider>
       <h3 style={{color:'red'}}>{err}</h3>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submit}>check</Button>
        </DialogActions>
      </Dialog>
      <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
    </div>
  );
}


export default React.forwardRef(CheckAvailability)