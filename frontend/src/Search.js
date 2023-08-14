import axios from 'axios';
import React, { useState,useEffect } from 'react';
import TestSnackbar from './TestSnackbar';
import LinearProgress from '@mui/material/LinearProgress';
import { statusColor,time } from './DisplayUtils';
import status from './status';

export default function Search(props){
    const API_URL = "http://localhost:5000";
    const [token,setToken]=useState(props.token);
    const [data, setData] = useState([])
    const [query, setQuery] = useState('');
    const [openSnackbar, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackbarMessage] = useState('');
    const [loadingCount, setLoadingCount] = useState(0);
    const [displayMessage,setDisplayMessage]=useState('')
    const handleChange = event => {
        setQuery(event.target.value);
        console.log(query)
    }

    useEffect(()=>{
      setToken(props.token);
    },[props.token])
    useEffect(() => {

        const getData = setTimeout(() => {

                if(query){
                  setLoadingCount(prev => prev + 1);
                    axios.get(API_URL+`/requests/search/${query}`, { headers: { Authorization: token } })
                    .then(docs=>{setData(docs.data.reqs);setLoadingCount(prev => prev - 1);})
                    .catch((err)=>{
                      setLoadingCount(prev => prev - 1);
                setSnackbarMessage(err.response.data.message);
              console.log(snackBarMessage);
                            setSnackbarOpen(true);
                            setTimeout(() => {
                                setSnackbarOpen(false);
                                setSnackbarMessage('')
                            }, 1000);
              })
            }else{
              setData([])
            }
          }, 1000)

          console.log(data)
          return () => clearTimeout(getData)
        
      }, [query]); 

      useEffect(()=>{
        if (data.length===0 && query){
          setDisplayMessage("Search did not generate any queries. Try again.")
        }
          else{
            setDisplayMessage('')
          }
      },[data])

    return(<>
    { loadingCount !== 0 ? <LinearProgress color="inherit" /> : null }
     <TestSnackbar message={snackBarMessage} bool ={openSnackbar}/>
     <h1>search </h1>
     <h2>enter title, description or date</h2>
     <div class="input-container">

       <input type="text" id="query" name="query" placeholder="enter query" onChange={handleChange} value={query} />
     </div>
     <h3>{displayMessage}</h3>
       {data.map(item=>{
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