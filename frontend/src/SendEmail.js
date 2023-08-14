import emailjs from 'emailjs-com';

     const sendEmail=(to_email,title,description,labName,date,start,end,labMessage,user,HODApproval,role) =>{
        emailjs.send('service_hbjfy1d', 'template_enk83es', {to_email,title,description,labName,date,start,end,labMessage,user,HODApproval,role},'iPfBZbNHka2iOMFC6')
        .then(function(response) {                           
           console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
           console.log('FAILED...', error);
        });
    }
    const sendDeniedEmail=(email,title,description,labName,date,start,end,labMessage,user,HODApproval,role) =>{
        emailjs.send('service_hbjfy1d', 'template_hce4pyp', {email,title,description,labName,date,start,end,labMessage,user,HODApproval,role},'iPfBZbNHka2iOMFC6')
        .then(function(response) {                            
           console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
           console.log('FAILED...', error);
        });
    }
export {sendEmail,sendDeniedEmail}