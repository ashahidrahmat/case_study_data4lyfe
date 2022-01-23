import React from 'react';
import tableGenerator from './ui_containers/tableGenerator';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import enLocale from 'date-fns/locale/en-US';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TimePicker from "@mui/lab/TimePicker";
import TextField from "@mui/material/TextField";

const createDeleteAppointmentView = (patients,doctors,appointments,setCreatePointment,setDeletePointment)=> {
    doctors = [{id:'none',name:'Select Doctor'},...doctors];
    patients = [{id:'none',name:'Select Patient'},...patients];
    const [doctor,setDoctor] = React.useState('none');
    const [patient,setPatient] = React.useState('none');
    const [error,setError] = React.useState();
    const [date,setDates] = React.useState(Date.now());
    const [time,setTimes] = React.useState(new Date(0, 0, 0, 8));
    //Add delete button to all appointments
    let appointmentToDisplay = appointments.map(apm => {
        return [...apm,(<Button variant="contained"  onClick={()=>{
            setDeletePointment(apm[0]);
        }}>Delete Appointment</Button>)];
    })
    return <div>
        <Stack spacing={2} direction="column">
            <Stack spacing={2} direction="row">
                <Select
                    labelId="doctorsSelect"
                    id="doctorsSelect"
                    value={doctor}
                    label="Doctor"
                    onChange={event=>setDoctor(event.target.value)}
                    >
                        {
                            doctors.map(doc=><MenuItem value={doc.id}>{doc.name}</MenuItem>)
                        }
                </Select>
                <Select
                    labelId="doctorsSelect"
                    id="doctorsSelect"
                    value={patient}
                    label="Doctor"
                    onChange={event=>setPatient(event.target.value)}
                    >
                        {
                            patients.map(doc=><MenuItem value={doc.id}>{doc.name}</MenuItem>)
                        }
                </Select>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DatePicker
                        mask={'__/__/____'}
                        label="Date"
                        value={date}
                        onChange={(newValue) => {
                            let newDatTime = moment(newValue);
                            setDates(newDatTime.unix()*1000);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <TimePicker
                        label="TimeSlot"
                        views={['hours']}
                        minTime={moment().set({hour:7,minute:59}).toDate()}
                        maxTime={moment().set({hour:16}).toDate()}
                        value={time}
                        onChange={(newValue) => {
                            setTimes(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <Button variant="contained"  onClick={()=>{
                        if(doctor == "none" || patient == "none"){
                           setError('Please select a patient/doctor');
                           return;
                        }
                        let dateToAdd = moment(date),
                        timeToAdd = moment(time);
                        dateToAdd.set({hour:timeToAdd.get('hour')});
                        setCreatePointment({type:'create',patient,doctor,dateTime:dateToAdd.unix()*1000});
                    }}>Create Appointment</Button>
            </Stack>
            {
                error && 
                <Stack direction="row">
                    <h4 style={{color:'red'}}>{error}</h4>
                </Stack>
            }
            <Stack  direction="row">
                {
                    tableGenerator({
                        header:['Appoinment Id','Doctor','Patient','Date and Time','Action'],
                        body:appointmentToDisplay
                    })
                }
            </Stack>
        </Stack>
       
    </div>
}

export default createDeleteAppointmentView;