import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './home.css'
import EditRequest from './EditRequest';
import DeleteRequest from './DeleteRequest';
import DeleteLab from './DeleteLab';
import TestSnackbar from './TestSnackbar';
import status from './status';
import LinearProgress from '@mui/material/LinearProgress';
import { labs } from './Options';
import { statusColor,time } from './DisplayUtils';


export default function Home(props) {
  const [userName, setUserName] = useState(props.userName);
  const [role, setRole] = useState(props.role);
  const [token, setToken] = useState(props.token);
  const alertRef = useRef();
  const deleteLabRef = useRef();
  const deleteReqRef = useRef();
  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState('')
  const [displayMessage,setDisplayMessage]=useState('')
  const API_URL = "https://lab-scheduling-system-backend.onrender.com";

  const [date, setDate] = useState(() => {
    var dt = new Date();
    // console.log(dt.getDate() + '-' + (dt.getMonth() + 1) + "-" + dt.getFullYear())
    return (dt.getMonth() + 1) + '-' + dt.getDate() + "-" + dt.getFullYear();
  });
  useEffect(() => {
    setUserName(props.userName);
    setRole(props.role);
    setToken(props.token)
  }, [props.token, props.role, props.userName])
  useEffect(() => {
    setLabFilter("All labs");
  }, []);

  const [data, setData] = useState([])
  const [labClass, setLab] = useState([])
  const [allDocs, setAllDocs] = useState([])
  const [sortedDocs, setSorted] = useState([])
  const [displayDocs, setDisplay] = useState([])
  const [labFilter, setLabFilter] = useState();
  const [updateTitle, setupdateTitle] = useState('')
  const [updateDescription, setupdateDescription] = useState('')
  const [updateVenue, setupdateVenue] = useState('')
  const [updateStartTime, setupdateStartTime] = useState('')
  const [updateEndTime, setupdateEndTime] = useState('')
  const [updateDate, setupdateDate] = useState('')
  const [updateId, setupdateId] = useState('')
  const [updateType, setupdateType] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [loadingCount, setLoadingCount] = useState(0);

  const handlelabFilterChange = event => {
    setLabFilter(event.target.value);

  }
  useEffect(() => {
    console.log(date)
    setLoadingCount(prev => prev + 1);
    console.log("home token", token);
    axios.get(API_URL + `/requests/get/${date}`, { headers: { Authorization: token } })
      .then(docs => { console.log("docs", docs); setData(docs.data.reqs); setLoadingCount(prev => prev - 1); })
      .catch((err) => {
        setLoadingCount(prev => prev - 1);
        setSnackbarMessage("couldnt fetch requests: " + err.response.data.message||"cannot connect to server");
        console.log(snackBarMessage);
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setSnackbarMessage('')
        }, 1000);
      })
  }, [date]);
  useEffect(() => {

    setLoadingCount(prev => prev + 1);

    axios.get(API_URL + `/lab/get/${date}`, { headers: { Authorization: token } })
      .then(docs => {
        setLab(docs.data.reqs);
        setLoadingCount(prev => prev - 1);
      })
      .catch((err) => {
        setLoadingCount(prev => prev - 1);
        setSnackbarMessage(err.response.data.message||"cannot connect to server");
        console.log(snackBarMessage);
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
          setSnackbarMessage('')
        }, 1000);
        console.log("role", role)

      })
  }, [date]);

  useEffect(() => {
    setAllDocs([]);
    console.log(data)
    setAllDocs(prev => [...prev, ...data])
    setAllDocs(prev => [...prev, ...labClass])
  }, [data, labClass])


  useEffect(() => {
    allDocs.sort(function (a, b) {
      const t1Hr = parseInt(a.startTime.split(':')[0]);
      const t1Min = parseInt(a.startTime.split(':')[1]);
      const t2Hr = parseInt(b.startTime.split(':')[0]);
      const t2Min = parseInt(b.startTime.split(':')[1]);
      if ((t1Hr === t2Hr) && (t1Min === t2Min)) return 0;
      if (t1Hr > t2Hr) return 1;
      if ((t1Hr === t2Hr) && (t1Min > t2Min)) return 1;
      return -1;
    });
    setSorted([])
    setSorted(allDocs)

  }, [allDocs])
  useEffect(()=>{
    if (allDocs.length===0 ){
      setDisplayMessage("Nothing scheduled yet on this date in this lab")
    }
      else{
        setDisplayMessage('')
      }
  },[data])

  useEffect(() => {
    if (labFilter !== "All labs") {
      setDisplay(sortedDocs.filter((v) => v.labName === labFilter));
    }
    else {
      setDisplay(sortedDocs)
    }
  }, [labFilter, sortedDocs])


  const openDeletePrompt = (id) => {
    setDeleteId(id)
    console.log("delte id: ", deleteId)
    deleteReqRef.current.setRefOpen(true);
  }
  const openDeleteLabPrompt = (item) => {
    console.log(item._id)
    setDeleteId(item._id)
    console.log("delte id: ", deleteId);
    deleteLabRef.current.setRefOpen(true);
  }
  const openEditPrompt = (item) => {
    setupdateId(item._id)
    setupdateTitle(item.title);
    setupdateDescription(item.description);
    setupdateStartTime(item.startTime);
    setupdateEndTime(item.endTime);
    setupdateDate(item.dateOfEvent);
    setupdateVenue(item.labName);
    setupdateType(item.eventType);
    alertRef.current.setRefOpen(true);
  }

  return (<>
    {loadingCount !== 0 ? <LinearProgress color="inherit" /> : null}
    <TestSnackbar message={snackBarMessage} bool={openSnackbar} />
    <DeleteLab ref={deleteLabRef} id={deleteId} token={token} />
    <h1>Lab Schedule</h1>
    <div id="time-picker">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker format='DD-MM-YYYY' selected={date} onChange={date => {setDate(String(date["$y"])+'-'+String(date["$M"]+1)+'-'+String(date["$D"]));console.log("new date: ",date)}} />

      </LocalizationProvider>

      <select id="filter" onChange={handlelabFilterChange} value={labFilter}>
        {labs.map((lab) => <option value={lab.value}>{lab.label}</option>)}
      </select>
    </div>
    <hr></hr>
    <h3>{displayMessage}</h3>
    <DeleteRequest ref={deleteReqRef} id={deleteId} />
    <EditRequest id={updateId} type={updateType} title={updateTitle} desc={updateDescription} date={updateDate} starttime={updateStartTime} endtime={updateEndTime} venue={updateVenue} token={token} ref={alertRef} />
    <div id="item-container"></div>
    {displayDocs.map(item => {
      if (item.type === 0 && item.HODApproval===1 &&item.labApproval===1) {
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
        })()}</span></div><div>{(userName === item.userId) ? <button style={{backgroundColor:'transparent'}} onClick={() => openEditPrompt(item)} >edit</button> : null} {(userName === item.userId) ? <button style={{backgroundColor:'transparent'}} onClick={() => openDeletePrompt(item._id)} >delete</button> : null}</div></div></div>
      }
      else if(item.type===1){

        return <div><div id="wrapper"><div id="item-title"><strong>class:{item.semester}{item.section} batch:{item.batch}</strong></div><div>{item.labName}</div><div>subject: {item.subject}</div><div><span>From:{time(item.startTime)} </span> <span>To:{time(item.endTime)}</span>{(role === "Lab Incharge") ? <button style={{backgroundColor:'transparent'}} onClick={() => openDeleteLabPrompt(item)} >delete</button> : null}</div></div></div>
      }
    })}

  </>)
}