import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import tableGenerator from './ui_containers/tableGenerator';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import enLocale from 'date-fns/locale/en-US';
import Stack from '@mui/material/Stack';

const doctorView = (doctors,data,setDoctorDate)=>{
    //get dates from data
    doctors=[{id:"all",name:'All'},...doctors]
    const [doctor,setDoctors] = React.useState(doctors[0].id)
    const [date,setDates] = React.useState(Date.now())
    return <div>
            <Stack spacing={2} direction="column">
                <Stack spacing={2} direction="row">
                    <Select
                    labelId="doctorsSelect"
                    id="doctorsSelect"
                    value={doctor}
                    label="Doctor"
                    onChange={event=>setDoctors(event.target.value)}
                    >
                        {
                            doctors.map(doc=><MenuItem value={doc.id}>{doc.name}</MenuItem>)
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
                    
                </Stack>
                <Stack spacing={2} direction="row">
                    <Button variant="contained"  onClick={()=>{
                        setDoctorDate({doctor});
                    }}>Filter By Doctor</Button>
                    <Button variant="contained"  onClick={()=>{
                        setDoctorDate({date});
                    }}>Filter By Date</Button>
                    <Button variant="contained"  onClick={()=>{
                        setDoctorDate({doctor,date});
                    }}>Filter By Both</Button>
                    <Button variant="contained"  onClick={()=>{
                        setDoctorDate({});
                    }}>Reset</Button>
                </Stack>
            </Stack>
            <div>
                    {
                        tableGenerator({
                            header:['APPOINTMENT ID','DOCTOR NAME','DATE'],
                            body: data
                        })
                    }
            </div>
         
    </div>
}

export default doctorView;