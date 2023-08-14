import React from 'react';
export default function Logout(){
    const logoutSubmit = () =>{
        localStorage.removeItem("token")
        console.log(localStorage.getItem("token"))
        window.location.href = '/';
    }
    return(<>
    <div onClick={()=>logoutSubmit()}>logout</div>
    </>)
}