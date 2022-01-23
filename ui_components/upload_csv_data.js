import { typography } from '@mui/system';
import React from 'react';

const csvAndEntityView = (setCSVIsUploaded)=>{
    const [err,setErr] = React.useState(false);
    const uploadCSV = (data)=>{
        //send api call to stream data to backend
        const formData = new FormData();
        formData.append('name', "dataDummy");
        formData.append('toParse', data.target.files[0]); 
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'multipart/form-data',
                //'Content-Type': 'application/json',
                ContentType: 'multipart/form-data'
            },
            body: formData
          }
        fetch(`/api/upload`, options)
        .then(resp => resp.json())
        .then(result => {
           if(result.status=="success"){
                setCSVIsUploaded(true);
                //alert('Successfully processed csv');
           }else{
                setCSVIsUploaded(false);
                setErr(true);
                // alert('Failed to process csv');
           }
        })
           
        
    }
    return <div>
        <h2>Entities and relatios</h2>
        <h3>There are 3 entities, patients, doctors and appointments, patients are linked to doctors via appointments where</h3>
        <h3>patients (==*==) appointments (==*==) doctors</h3>
        <h3>Patients can have many appointments that can be assigned to many doctors</h3>
        <h2>Upload csv</h2>
        <h3>Please upload csv file before proceeding to Question 2 thanks!</h3>
        <h3>CSV should have the following headers, else upload will fail</h3>
        <h4>doctor_id, doctor_name, patient_id, patient_name, patient_age, patient_gender, appointment_id, appointment_datetime</h4>
        <input type="file" name="toProcess" onChange={uploadCSV} />
        {
            err && <typography>There is an error when uploading. Please try again.</typography>
        }
    </div>
}

export default csvAndEntityView;