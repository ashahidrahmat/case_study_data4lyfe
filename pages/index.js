import React, {useEffect} from 'react';
import styles from '../styles/Home.module.css';
import generateAccordion from '../ui_components/ui_containers/accordionGenerator';
import q1 from '../ui_components/upload_csv_data';
import q2 from '../ui_components/doctors_view';
import q3q4 from '../ui_components/create_delete_appointment';
import { set } from 'date-fns';
var loadDataOnce = true;

const fetcher = (url,options={method:'POST'},customCallback)=>{
  return new Promise((resolve,reject)=>{
    fetch(url,options)
    .then(resp => resp.json())
    .then(data=>{
      return customCallback ? resolve(customCallback(data)) : resolve(data) ;
    })
    .catch(err=>reject(err));
  })
}

const getAllPointmentData = ()=>{
  return fetcher('/api/getAllAppointments');
}

const getDoctorPointmentData = (doctor,date)=>{
  return fetcher('/api/getDoctorPointment',{
    method:'Post',
    body:JSON.stringify({doctor,date}),
    headers: {
      'Content-Type': 'application/json'
    }});
}

const getAllDocsPatientsAppointments = ()=>{
  return fetcher('/api/getAll');
}

const createDeleteAppointment = (props)=>{
    return fetcher('/api/createDeleteAppointment',{
      method:'Post',
      body:JSON.stringify(props),
      headers: {
        'Content-Type': 'application/json'
      }});
}

const Home = ()=>{
  const [doctors,setDoctors] = React.useState([])
  const [patients,setPatients] = React.useState([])
  const [appoinntments,setAppoinntments] = React.useState([])
  const [doctorPointmentData, setDoctorPointmentData] = React.useState([])
  const [csvUploaded, setCSVIsUploaded] = React.useState(false);
  const [doctorPointmentFilter, setDoctorPointment] = React.useState({})
  const [createPointment,setCreatePointment] = React.useState({});
  const [deletePointment,setDeletePointment] = React.useState('');
  
  useEffect(()=>{
      fetch(`/api/resetDB`,{method:'POST'});
  },[]);

  useEffect( ()=>{ 
    if(csvUploaded && loadDataOnce){
      (async () =>{
          loadDataOnce=false;
          let data = await getAllDocsPatientsAppointments();
          setDoctors(data.doctors);
          setPatients(data.patients);
          let pointmentData = await getDoctorPointmentData();
          setDoctorPointmentData(pointmentData);
          let allPointmentData = await getAllPointmentData();
          setAppoinntments(allPointmentData);
      })()
    }
  });

  useEffect(()=>{
    if(doctorPointmentFilter.doctor != "all" || doctorPointmentFilter.doctor != undefined){
      (async ()=>{
        let pointmentData = await getDoctorPointmentData(doctorPointmentFilter.doctor,doctorPointmentFilter.date);
          setDoctorPointmentData(pointmentData);
      })()
    }else{
      (async ()=>{
        let pointmentData = await getDoctorPointmentData();
          setDoctorPointmentData(pointmentData);
      })()
    }
  },[doctorPointmentFilter]);

  useEffect(()=>{
    (async ()=>{
      if(createPointment.type){
        await createDeleteAppointment(createPointment);
        let newData = await getAllPointmentData();
        setAppoinntments(newData);
      }
    })()
  },[createPointment]);

  useEffect(()=>{
    (async ()=>{
      if(deletePointment != ""){
        await createDeleteAppointment({appointment:deletePointment});
        let newData = await getAllPointmentData();
        setAppoinntments(newData);
      }
    })()
  },[deletePointment]);

  let question1Title="Question 1" + (csvUploaded ? ": Data uploaded successfully":"");
  return (
    <div className={styles.container}>
      {
        generateAccordion({
          [question1Title]:{component:q1(setCSVIsUploaded),enabled:!csvUploaded},
          "Question 2":{component:q2(doctors,doctorPointmentData,setDoctorPointment),enabled:csvUploaded},
          "Question 3 & 4":{component:q3q4(patients,doctors,appoinntments,setCreatePointment,setDeletePointment),enabled:csvUploaded}
        })
      }
    </div>
  )
}

export default Home;