import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TestSnackbar from './TestSnackbar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import CheckAvailability from './CheckAvailability';
import LinearProgress from '@mui/material/LinearProgress';
import { labs,events } from './Options';

export default function CreateRequest(props){
    const [err, setErr] = useState('')
    const[userName,setUserName]=useState(props.userName);
    const[role,setRole]=useState(props.role);
    const [token,setToken]=useState(props.token);
    const [userEmail,setEmail]=useState(props.email);
    const [loadingCount, setLoadingCount] = useState(0);
useEffect(()=>{
setUserName(props.userName);
setRole(props.role);
setToken(props.token);
setEmail(props.email)
},[props.userName,props.role,props.token,props.email])
    const API_URL = "http://localhost:5000";
    const [title,setTitle]=useState();
    const [description,setDescription]=useState();
    const [date,setDate]=useState();
    const [start,setStart]=useState();
    const [end,setEnd]=useState();
    const [event,setEventName]=useState("seminar");
    const [labName,setLabName]=useState("WPL");
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')

    const handleEventNameChange = e => {
        setEventName(e.target.value);
        console.log(event)
        setErr('')
    }
    const handlelabNameChange = event => {
        setLabName(event.target.value);
        console.log(labName)
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
    let x;
    const handleStartTimeChange = (time) => {
        x=time;
        console.log(JSON.stringify(x))
          setStart(time["$H"]+":"+time["$m"])
          setErr('')
        };
        const handleEndTimeChange = (time) => {
            setEnd(time["$H"]+":"+time["$m"])
            console.log("start" , end)
            setErr('')
  };



    const sendRequest = async e => {
        e.preventDefault();

        if(!title){
            setErr('title is required')
            return;
        }
        if(!description){
            setErr('description is required')
            return;
        }
        if(!date){
            setErr('date is required')
            return;
        }
        if(!start){
            setErr('starting time is required')
            return;
        }
        if(!end){
            setErr('ending time is required')
            return;
        }
        if(!labName){
            setErr('lab name is required')
            return;
        }
        if(!event){
            setErr('type of event is required')
            return;
        }
        try {
               
            const eventType=event;
            setLoadingCount(prev => prev + 1);
                let res =await axios.post(API_URL+`/requests/`,{title,description,dateOfEvent:date,startTime:start,endTime:end,userId:userName,labName,eventType,email:userEmail},{headers: {Authorization: token}});
                setLoadingCount(prev => prev - 1);
                console.log(res.data.status)
                console.log("bruh")

                if(res.data.status===420){
                    setLoadingCount(prev => prev - 1);
                    setSnackbarMessage(res.data.message+"details: "+res.data.details.title+"Time :"+res.data.details.startTime+"to "+res.data.details.endTime);
                    console.log(snackBarMessage);
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                        setSnackbarMessage('')
                    }, 1000);
                }
                else{
                    setLoadingCount(prev => prev - 1);
                    setSnackbarMessage(res.data.message);
                    console.log(snackBarMessage);
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                        setSnackbarMessage('')
                    }, 1000);
                    setTimeout(() => {
                        window.location.reload()

                    }, 1000);
                }
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

    return (<>
    { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
    
    <form autocomplete="off" class="create form" onSubmit={sendRequest}>
    <h1>Create a request</h1>
    
    <div class="input-container">
    event type: <select onChange={handleEventNameChange} value={event} required> 
      {events.map((event) => <option value={event.value}>{event.label}</option>)}
    </select> <br></br></div>
    <div class="input-container"><input placeholder='title' type="text" id="title" name="title" onChange={handleTitleChange} value={title} /><br></br>
    </div>
    <div class="input-container">

    <textarea placeholder='description' type="text" id="description" name="description" onChange={handleDescChange} value={description} /> <br></br>
    </div>
    labName: <select onChange={handlelabNameChange} value={labName}> 
      {labs.map((lab) => <option value={lab.value}>{lab.label}</option>)}
    </select> <br></br>
    date:
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format="DD-MM-YYYY" selected={date} onChange={date => setDate(String(date["$M"]+1)+'-'+String(date["$D"])+'-'+date["$y"])}/>
    </LocalizationProvider> <br></br>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleStartTimeChange}
          label="start time" 
          defaultTime={new Date(2007, 11, 5, 8, 23, 17)}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
        />

        </LocalizationProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleEndTimeChange}
          label="ending time"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />

        </LocalizationProvider>
    <h3 style={{color:'red'}}>{err}</h3>
        <button type="submit" class= "submit">submit</button>
        </form>
        <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
        <CheckAvailability token={token} loading ={setLoadingCount}/>
    </>)

}