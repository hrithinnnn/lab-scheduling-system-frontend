import axios from 'axios';
import React, { useState,useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import AlertComponent from './AlertComponent';
import LinearProgress from '@mui/material/LinearProgress';
import { labs } from './Options';
export default function ScheduleLabClasses(props){

    const alertRef = useRef();
    const [err, setErr] = useState('')
    const[userName,setUserName]=useState(props.userName);
    const[role,setRole]=useState(props.role);
    const [token,setToken]=useState(props.token);
    const API_URL = "https://lab-scheduling-system-backend.onrender.com";
    const [alertTitle,setAlertTitle]=useState();
    const [alertMsg,setAlertMsg] =useState();
    const [section,setSection]=useState();
    const [open,setOpen]=useState(false);
    const [labName,setLabName]=useState("WPL");
    const [semester,setSemester]=useState();
    const [batch,setBatch]=useState();
    const [startDate,setStartDate]=useState();
    const [numberOfClasses,setNumberClasses]=useState();
    const [startHour,setStartHour]=useState(0);
    const [startMinutes,setStartMinutes]=useState(0);
    const [endHour,setEndHour]=useState(0);
    const [endMinutes,setEndMinutes]=useState(0);
    const [start,setStart]=useState();
    const [end,setEnd]=useState();
    const [subject,setSubject]=useState();
    const [loadingCount, setLoadingCount] = useState(0);
    useEffect(()=>{
        setUserName(props.userName);
        setRole(props.role);
        setToken(props.token);
    },[props.token,props.userName,props.role])
    const handleStartTimeChange = (time) => {
        setStart(time["$H"]+":"+time["$m"])
        setErr('')
      };
      const handleEndTimeChange = (time) => {
          setEnd(time["$H"]+":"+time["$m"])
          console.log("start" , end)
          setErr('')
};

    const handleSectionChange = event => {
        setSection(event.target.value);
        setErr('')
    }
    const handlelabNameChange = event => {
        setLabName(event.target.value);
        setErr('')
    }
    const handleBatchChange = event => {
        setBatch(event.target.value);
        setErr('')
    }
    const handleNumberChange = event => {
        setNumberClasses(event.target.value);
        setErr('')
    }
    const handleSemChange = event => {
        setSemester(event.target.value);
        setErr('')
    }
    const handleSubjectChange = event => {
        setSubject(event.target.value);
        setErr('')
    }



    const sendRequest = async e => {
        e.preventDefault();
        if(!section){
            setErr('section is required');
            return;
        }
        if(!semester){
            setErr('semester is required');
            return;
        }
        if(!batch){
            setErr('batch is required');
            return;
        }
        if(!startDate){ 
            setErr('startDate is required');
            return;
        }
        if(!start==="0:0"){
            setErr('starting time is required')
            return;
        }
        if(!end==="0:0"){
            setErr('ending time is required')
            return;
        }
        if(!labName){
            setErr('lab name is required')
            return;
        }
        if(!subject){
            setErr('subject is required')
            return;
        }
        if(!numberOfClasses){
            setErr('number of classes is required')
            return;
        }

        try {
            console.log(startDate)
                let i=0;
                let currDate= new Date(startDate);
                const classStatus = [];
                currDate.setDate(currDate.getDate() - 7);
                setLoadingCount(prev => prev + 1);
                while(i<numberOfClasses){
                    currDate.setDate(currDate.getDate() + 7);
                    let classDate=`${currDate.getMonth()+1}-${currDate.getDate()}-${currDate.getFullYear()}`
                    let res =await axios.post(API_URL+`/lab/`,{section,semester,batch, dateOfClass:classDate,startTime:start,endTime:end,subject,labName},{headers: {Authorization: token}});
                    console.log(classDate);
                    if(res.status !== 200) {
                        classStatus.push({
                            classDate,
                            status: res.status === 201 ? "overlap" : "bad"
                        })
                    } else classStatus.push({
                        classDate,
                        status: "success"
                    });
                    i++;
                }
                setLoadingCount(prev => prev - 1);
                console.log(classStatus)
                const success=classStatus.filter((v) => v.status === "success");
                const overlap=classStatus.filter((v) => v.status === "overlap");
                const bad=classStatus.filter((v) => v.status === "bad");
                let successDates=[];
                let overlapDates=[];
                let badDates=[];
                success.map((item)=>{console.log(item);successDates.push(new Date(item.classDate).getDate()+'-'+(parseInt(new Date(item.classDate).getMonth())+1).toString()+'-'+new Date(item.classDate).getFullYear())})
                console.log(successDates)
                overlap.map((item)=>{console.log(item);overlapDates.push(new Date(item.classDate).getDate()+'-'+(parseInt(new Date(item.classDate).getMonth())+1).toString()+'-'+new Date(item.classDate).getFullYear())})
                console.log(overlapDates)
                bad.map((item)=>{console.log(item);badDates.push(new Date(item.classDate).getDate()+'-'+(parseInt(new Date(item.classDate).getMonth())+1).toString()+'-'+new Date(item.classDate).getFullYear())})
                console.log(overlapDates)
                let alertStrings = [];
                if(success.length>0){
                    alertStrings.push(success.length + " success: "+successDates.toString());
                }
                if(overlap.length>0){
                    alertStrings.push(overlap.length + " overlaps "+overlapDates.toString());
                }
                if(bad.length>0){
                    alertStrings.push(bad.length + " bad requests "+badDates.toString());
                }
                setAlertTitle("Status");
                setAlertMsg(alertStrings.toString());
                alertRef.current.setRefOpen(true);
                console.log("Alerted");
            }
         catch (err) {
            setAlertTitle("Status");
            setAlertMsg(err.message);
            alertRef.current.setRefOpen(true);
            console.log("Alerted");
        }
    }
    return (<>
    { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
    <form autocomplete="off" class=" schedule form" onSubmit={sendRequest}>

    <h1>schedule Lab Classes</h1>
    <div class="input-container">
  lab: <select onChange={handlelabNameChange} value={labName}> 
      {labs.map((lab) => <option value={lab.value}>{lab.label}</option>)}
    </select> <br></br>
    </div>
    <div class="input-container">
   <input placeholder="semester" type="number" id="sem" name="sem" onChange={handleSemChange} value={semester} /> <br></br>
   </div>
   <div class="input-container">
   <input placeholder="section" type="text" id="section" name="section" onChange={handleSectionChange} value={section} /> <br></br>
   </div>
   <div class="input-container">

    <input placeholder='batch' type="number" id="sem" name="sem" onChange={handleBatchChange} value={batch} /> <br></br>
   </div>
   <div class="input-container">

    <input placeholder='subject' type="text" id="subject" name="subject" onChange={handleSubjectChange} value={subject} /> <br></br>
   </div>
    <div class="input-container">

    <input placeholder='number of classes' type='number' id="numberOfClasses" name="numberOfClasses" onChange={handleNumberChange} value={numberOfClasses} /> <br></br>
    </div>
   date: <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker selected={startDate} format="DD-MM-YYYY" onChange={date => setStartDate(String(date["$y"])+'-'+String(date["$M"]+1)+'-'+String(date["$D"]))}/>
    </LocalizationProvider> <br></br>
   start time: <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleStartTimeChange}
        //   value={start}
        label={"starting time"}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />

        </LocalizationProvider> <br></br>
   end time: <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          onChange={handleEndTimeChange}
        //   value={end}
        label={"ending time"}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />

        </LocalizationProvider> <br></br>
        <h3 style={{color:'red'}}>{err}</h3>
        <button type="submit" class="submit">submit</button>
    </form>

     <AlertComponent ref={alertRef} title={alertTitle} message={alertMsg} /> 
    </>)

}