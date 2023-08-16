import React, { useState,useEffect, useImperativeHandle, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TestSnackbar from './TestSnackbar';
import { time,statusColor } from './DisplayUtils';
import status from './status';

function ApproveResponse(props, ref) {
    const [data,setData]=useState([]);
    const [date,setDate]=useState(props.date);
    const [start,setStart]=useState(props.starttime);
    const [end,setEnd]=useState(props.endtime);
    const [labName,setLabName]=useState(props.venue);
    const [open, setOpen] = React.useState(false);
    const [displayMessage,setDisplayMessage] =useState();


  useImperativeHandle(ref, () => ({
    setRefOpen(open) {
      console.log("props", props)
      setOpen(open);
    },
    setRefMessage(message){
      setDisplayMessage(message)
    },
    setRefData(data){
      setData(data)
    }
  }))

  const handleClose = () => {

    setOpen(false);
    setDisplayMessage('')
  };

  useEffect(()=>{
    setStart(props.starttime);
    setEnd(props.endtime);
    setDate(props.date);
    setLabName(props.venue);
  },[props.starttime,props.endtime, props.date,props.venue])

  useEffect(()=>{
  },[props.starttime,props.endtime, props.date,props.venue,props.token])
  useEffect(()=>{
    if(props.starttime&&props.endtime&& props.date&&props.venue&&props.token){
    message();
    setOpen(true);
    }
  },[data]);

  const message=()=>{
    if(data.length===0){
        setDisplayMessage(`${labName} is available on ${date} from ${start} to ${end} `)
    }
    else{
        setDisplayMessage(`${labName} is not available on ${date.split('T')[0]} from ${start} to ${end}. ask the owner of the following request(s) or labs to delete the following request(s) or lab classes and try again. `)
    }
  }

  return (
    <div>

      <Dialog open={open}>
        <DialogContent>
          <h1>Lab is not free</h1>
          {displayMessage}
          {data.length>0?data.map(item=>{
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
    }):null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default React.forwardRef(ApproveResponse)