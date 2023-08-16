import React, { useState,useEffect } from 'react';
import {Route,Routes} from 'react-router-dom'
import Home from './Home'
import Search from './Search'
import CreateRequest from './CreateRequest'
import ScheduleLabClasses from './ScheduleLabClasses'
import Lab from './Lab'
import Hod from './Hod';
import Summary from './Summary'
import UpdateProfile from './UpdateProfile';
import Logout from './Logout';

export default function RouterComponent(props) {
    const [userName,setName] = useState(props.userName);
    const [role,setRole] = useState(props.role);
    const [token,setToken] = useState(props.token);
    const [email,setEmail]=useState(props.email);
    const [phone,setPhone]=useState(props.phone);
    const [instituition,setInstituition]=useState(props.instituition);
    const [password,setPassword]=useState(props.password);
    useEffect(()=>{
        setName(props.userName);
        setRole(props.role);
        setToken(props.token);
        setEmail(props.email);
        setPassword(props.password);
        setPhone(props.phone);
        setInstituition(props.instituition);
        console.log("App token", token)
    },[props.userName,props.role,props.token,props.phone,props.instituition,props.email,props.password])
    return (
        

            <Routes>
                <Route path="/" element={<Home role={role} userName={userName} token={token}/>} exact />
                <Route path="/create" element={<CreateRequest email={email} role={role} userName={userName} token={token}/>} />
                <Route path="/search" element={<Search token={token}/>} />
                <Route path="/scheduleLabClasses" element={<ScheduleLabClasses  role={role} userName={userName} token={token}/>} />
                <Route path="/hodapproval" element={<Hod  role={role} userName={userName} token={token}/>} />
                <Route path='/labapproval' element={<Lab  role={role} userName={userName} token={token}/>} />
                <Route path='/summary' element={<Summary role={role} userName={userName} token={token}/>} />
                <Route path='/updateprofile' element={<UpdateProfile userName={userName} email={email} password={password} instituition={instituition} role={role} phone={phone} token={token} />} />
                <Route path='/logout' element={<Logout />} />
            </Routes>

    )
}
