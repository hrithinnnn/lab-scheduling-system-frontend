import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TestSnackbar from './TestSnackbar';
import LinearProgress from '@mui/material/LinearProgress';
import { labs } from './Options';
import { time,statusColor } from './DisplayUtils';
import status from './status';


export default function Home(props) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [labClasses, setLabClasses] = useState(0);
  const [seminar, setSeminar] = useState(0);
  const [workshops, setWorkshops] = useState(0)
  const [workshopsHrs, setWorkshopsHrs] = useState(0)
  const [labClassesHrs, setLabClassesHrs] = useState(0);
  const [seminarHrs, setSeminarHrs] = useState(0);
  const [token,setToken]=useState(props.token);
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
  const API_URL = "https://lab-scheduling-system-backend.onrender.com";
  useEffect(()=>{
    setToken(props.token);
  },[props.role,props.userName,props.token])
  const [startDate, setStartDate] = useState(() => {
    var dt = new Date();
    console.log(dt.getDate() + '-' + (dt.getMonth() + 1) + "-" + dt.getFullYear())
    return (dt.getMonth() + 1) + '-' + dt.getDate() + "-" + dt.getFullYear();
  });

  const [endDate, setEndDate] = useState(() => {
    var dt = new Date();
    console.log(dt.getDate() + '-' + (dt.getMonth() + 1) + "-" + dt.getFullYear())
    return (dt.getMonth() + 1) + '-' + dt.getDate() + "-" + dt.getFullYear();
  });

  useEffect(() => {

    setLabFilter("All labs");

  }, []);


  const [data, setData] = useState([])
  const [labClass, setLab] = useState([])
  const [allDocs, setAllDocs] = useState([])
  const [sortedDocs, setSorted] = useState([])
  const [displayDocs, setDisplay] = useState([])
  const [labFilter, setLabFilter] = useState();

  const handlelabFilterChange = event => {
    setLabFilter(event.target.value);

  }
  useEffect(() => {

    setLoadingCount(prev => prev + 1);
    axios.get(API_URL + `/requests/summary/${startDate}/${endDate}`, { headers: { Authorization: token } })
      .then(docs => {setData(docs.data.reqs);setLoadingCount(prev => prev - 1);})
      .catch((err) => {
        setLoadingCount(prev => prev - 1);
        setSnackbarMessage("couldnt fetch requests: " + err.response.data.message);
        console.log(snackBarMessage);
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setSnackbarMessage('')
        }, 1000);
      })
  }, [startDate, endDate]);
  useEffect(() => {

    setLoadingCount(prev => prev + 1);
    axios.get(API_URL + `/lab/summary/${startDate}/${endDate}`, { headers: { Authorization: token } })
      .then(docs => {setLab(docs.data.labClasses);setLoadingCount(prev => prev - 1);})
        .catch ((err) => {
          setLoadingCount(prev => prev - 1);
      setSnackbarMessage("couldnt fetch lab classes: " + err.response.data.message);
      console.log(snackBarMessage);
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
        setSnackbarMessage('')
      }, 1000);
    })
} , [startDate, endDate]);

useEffect(() => {
  setAllDocs([]);
  setAllDocs(prev => [...prev, ...data])
  setAllDocs(prev => [...prev, ...labClass])

}, [data, labClass])
useEffect(() => {
}, [labClass])


useEffect(() => {
  allDocs.sort(function (a, b) {
     let dt1=(a.type===0)? a.dateOfEvent:a.dateOfClass;
     let dt2=(b.type===0)? b.dateOfEvent:b.dateOfClass;
     let date1 = new Date(dt1).getTime();
     let date2 = new Date(dt2).getTime();
     if (date1 < date2) {
      return -1
    } else if (date1 > date2) {
      return 1
    } else {
      const t1Hr = parseInt(a.startTime.split(':')[0]);
    const t1Min = parseInt(a.startTime.split(':')[1]);
    const t2Hr = parseInt(b.startTime.split(':')[0]);
    const t2Min = parseInt(b.startTime.split(':')[1]);

    if ((t1Hr === t2Hr) && (t1Min === t2Min)) return 0;
    if (t1Hr > t2Hr) return 1;
    if ((t1Hr === t2Hr) && (t1Min > t2Min)) return 1;
    return -1;
    }
  });
  setSorted([])
  setSorted(allDocs)


}, [allDocs])

useEffect(() => {
  if (labFilter !== "All labs") {
    setDisplay(sortedDocs.filter((v) => v.labName === labFilter));
  }
  else {
    setDisplay(sortedDocs)
  }
}, [labFilter, sortedDocs])

const mins= (time) =>{
  return parseInt(time.split(":")[0])*60+parseInt(time.split(":")[1]);
}

useEffect(() => {
  setSeminar(0)
  setWorkshops(0)
  setLabClasses(0)
  setSeminarHrs(0)
  setWorkshopsHrs(0)
  setLabClassesHrs(0)
  displayDocs.map((item) => {
    if (item.eventType === "seminar") {
      setSeminar(prev => prev + 1);
      setSeminarHrs(prev => prev + mins(item.endTime)-mins(item.startTime))
    }
    else if (item.eventType === "workshop") {
      setWorkshops(prev => prev + 1)
      setWorkshopsHrs(prev => prev + mins(item.endTime)-mins(item.startTime))
    }
    else {
      setLabClasses(prev => prev + 1)
      setLabClassesHrs(prev => prev + mins(item.endTime)-mins(item.startTime))
    }
    console.log(item.eventType);
  }, [displayDocs])

}, [displayDocs])



return (<>
{ loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
  <TestSnackbar message={snackBarMessage} bool={openSnackbar} />
  <h1>Summary</h1>
  <div id="time-picker">
    start date:<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format='DD-MM-YYYY' selected={startDate} onChange={date => setStartDate(date["$y"]+'-'+String(date["$M"]+1)+'-'+String(date["$D"]))} />

      <br></br>end date:</LocalizationProvider>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format='DD-MM-YYYY' selected={endDate} onChange={date => setEndDate(date["$y"]+'-'+String(date["$M"]+1)+'-'+String(date["$D"]))} />

    </LocalizationProvider>
<br></br>
    <select onChange={handlelabFilterChange} value={labFilter}>
      {labs.map((lab) => <option value={lab.value}>{lab.label}</option>)}
    </select>
  </div>
  <hr></hr>
  <h2>report:</h2>
  <div>workshops:{workshops}</div>
  <div>seminar:{seminar}</div>
  <div>labClasses: {labClasses}</div>
  <div>workshops(in hours):{Math.floor(workshopsHrs/60)+"h"+Math.floor(workshopsHrs%60)+"m"}</div>
  <div>seminar(in hours):{Math.floor(seminarHrs/60)+"h"+Math.floor(seminarHrs%60)+"m"}</div>
  <div>labClasses(in hours):{Math.floor(labClassesHrs/60)+"h"+Math.floor(labClassesHrs%60)+"m" }</div>
  <div id="item-container"></div>
  {displayDocs.map(item => {
      if (item.type === 0) {
        time(item.startTime)
        return <div><div id="wrapper"><div id="item-title"><strong>{item.title}</strong></div><div>{item.description}</div><div>{item.eventType} at {item.labName}</div><div><span>From: {time(item.startTime)} </span> <span>To: {time(item.endTime)}</span></div><div>initiated by:{item.userId}</div><div><span>HOD approval:<span style={statusColor(status[item.HODApproval])}>{status[item.HODApproval]} </span></span><span>lab approval:<span style={statusColor(status[item.labApproval])}>{status[item.labApproval]}</span></span> <span>{(() => {
          if (item.approvedBy) {
            return <span> by {item.approvedBy}</span>
          } else if (item.deniedBy) {
            return <span> by {item.deniedBy}</span>
          }
          else {
            return null;
          }
        })()}</span></div></div></div>
      }
      else {

        return <div><div id="wrapper"><div id="item-title"><strong>class:{item.semester}{item.section} batch:{item.batch}</strong></div><div>{item.labName}</div><div>subject: {item.subject}</div><div><span>From:{time(item.startTime)} </span> <span>To:{time(item.endTime)}</span></div></div></div>
      }
    })}
</>)
}