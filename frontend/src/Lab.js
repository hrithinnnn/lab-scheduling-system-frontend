import axios from 'axios';
import React, { useState,useEffect,useRef } from 'react';
import TestSnackbar from './TestSnackbar';
import ApproveOrDenyLabPrompt from './ApproveOrDenyLabPrompt';
import LinearProgress from '@mui/material/LinearProgress';
import { statusColor,time } from './DisplayUtils';
import status from './status';
export default function Lab(props){
  const [loadingCount, setLoadingCount] = useState(0);
  const[userName,setUserName]=useState(props.userName);
  const[role,setRole]=useState(props.role);
  const [token,setToken]=useState(props.token);
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('')
    const [id,setId] =useState()
    const [statusReq,setStatus] = useState();
    const API_URL = "https://lab-scheduling-system-backend.onrender.com";
    const [pending, setPending] = useState([])
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
    const[approvedBy,setApproved]=useState();
    const[rejectedBy,setRejected] = useState();
    const [displayMessage,setDisplayMessage]=useState('')
    useEffect(()=>{
      setUserName(props.userName);
      setRole(props.role);
      setToken(props.token);
    },[props.role,props.userName,props.token]);
    useEffect(() => {
      try{
        setLoadingCount(prev => prev + 1);
        axios.get(API_URL+`/requests/lab`, { headers: { Authorization: token } })
        .then(docs=>{setPending(docs.data.labPending);setLoadingCount(prev => prev - 1);})
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
          setDisplayMessage("No pending requests")
        }
          else{
            setDisplayMessage('')
          }
      },[pending])
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
          setLabIncharge(item.user)
          setType(item.type);
          if(status===1){

            setApproved(userName);
          }
          else{

            setRejected(userName);
          }
          alertRef.current.setRefOpen(true);
      }
      return(<>
      { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
      <ApproveOrDenyLabPrompt loading={setLoadingCount} approvedBy={approvedBy} rejectedBy={rejectedBy} user={userName} ref={alertRef} title={title} description={description} email={email} labIncharge={labIncharge} type={type} id={id} status ={statusReq} token={token} lab={labName} date={date} start={start} end={end}/>
      <h1>lab approvals</h1>
      <h3>{displayMessage}</h3>
      {pending.map(item=>{
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
        })()}</span></div><div><button onClick={()=>{approveOrDeny(item,1)}}>approve</button><button onClick={()=>{approveOrDeny(item,2)}}>deny</button></div></div></div>
      }
    })}
         <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
      </>)
}