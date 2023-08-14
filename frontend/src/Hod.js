import axios from 'axios';
import React, { useState,useEffect,useRef } from 'react';
import TestSnackbar from './TestSnackbar';
import ApproveOrDenyHodPrompt from './ApproveOrDenyHodPrompt';
import LinearProgress from '@mui/material/LinearProgress';
import { statusColor,time } from './DisplayUtils';
import status from './status';
export default function Hod(props){
    const API_URL = "http://localhost:5000";
    const[role,setRole]=useState(props.role);
    const [token,setToken]=useState(props.token);
    const [pending, setPending] = useState([])
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    const [id,setId] =useState()
    const [statusReq,setStatus] = useState();
    const alertRef=useRef();
    const [date,setDate]=useState();
    const [labName,setLabName]=useState();
    const [start,setStart]=useState();
    const [end,setEnd]=useState();
    const [title,setTitle] = useState();
    const [description,setDescription]=useState();
    const [email,setEmail]=useState();
    const [labIncharge,setLabIncharge]=useState();
    const [type,setType]=useState();
    const [userId,setUserId]=useState();
    const[approvedBy,setApproved]=useState();
    const[rejectedBy,setRejected] = useState();
    const [loadingCount, setLoadingCount] = useState(0);
    const [displayMessage,setDisplayMessage]=useState('')
    useEffect(() => {
      try{
        setLoadingCount(prev => prev + 1);
        axios.get(API_URL+`/requests/hod`, { headers: { Authorization: token } })
        .then(docs=>{console.log(docs.data.HODPending);setPending(docs.data.HODPending);setLoadingCount(prev => prev - 1);})
      }catch(err){
        setLoadingCount(prev => prev - 1);
        setSnackbarMessage(err.response.data.message);
      console.log(snackBarMessage);
                    setSnackbarOpen(true);
                    setTimeout(() => {
                        setSnackbarOpen(false);
                        setSnackbarMessage('')
                    }, 1000);
      }
      }, []); 
      useEffect(()=>{
        if (pending.length===0 ){
          setDisplayMessage("No Pending requests")
        }
          else{
            setDisplayMessage('')
          }
      },[pending])
      useEffect(()=>{
        setToken(props.token)
        setRole(props.role)
      },[props.token,props.role])

        const approveOrDeny = async (item,status) => {
          setId(item._id);
          setStatus(status);
          setDate(item.dateOfEvent)
          setStart(item.startTime);
          setEnd(item.endTime);
          setLabName(item.labName);
          setTitle(item.title);
          setDescription(item.description)
          setEmail(item.email);
          setLabIncharge(item.approvedBy)
          setType(item.type);
          setUserId(item.userId);
          setApproved(item.approvedBy);
          setRejected(item.deniedBy);
          alertRef.current.setRefOpen(true);
      }
      return(<>
      { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
      <h1>hod approvals</h1>
      <h3>{displayMessage}</h3>
      {pending.map(item=>{
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
        })()}</span></div><div><button onClick={()=>{approveOrDeny(item,1)}}>approve</button><button onClick={()=>{approveOrDeny(item,2)}}>deny</button></div></div></div>
      
    })}
         <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
         <ApproveOrDenyHodPrompt loading={setLoadingCount} approvedBy={approvedBy} rejectedBy={rejectedBy} userId={userId} ref={alertRef} title={title} description={description} email={email} labIncharge={labIncharge} type={type} id={id} status ={statusReq} token={token} lab={labName} date={date} start={start} end={end}/>
      </>)
}

