//to simplify things we will emulate a db of sorts by creating a map with the entities
//Ideally creating data 
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const csv = require('csvtojson');
const moment = require('moment');
var db;

const initDBConnection = async ()=>{
    db = await open({
        filename:'./db/clinic.db',
        driver:sqlite3.Database
    });
    console.log('Connected to DB')
    return db;
}

const closeDBconnection = async ()=>{
    try{
        await db.close()
    }catch(er){
        return console.error(err.message);
    }
    return console.log('Conection to DB closed.');
}

const cleanTables = async ()=>{
    try{
        await db.run('DELETE FROM appointments');
        await db.run('DELETE FROM doctors');
        await db.run('DELETE FROM patients');
    }catch(er){
        return console.error(err.message);
    }
    return console.log('\nDB Tables cleaned.');
}

const uploadAppointment = async (csvData)=>{
    let dataObj = await csv().fromString(csvData.data.toString('utf8'));
    //generate patient,doctor and appointment data
    let patients={},doctors={},appointments={};
    dataObj.forEach(item=>{
        patients[item.patient_id]=[item.patient_name,item.patient_age,item.patient_gender];
        doctors[item.doctor_id]=[item.doctor_name];
        let parseDateTime = moment(item.appointment_datetime,'DDMMYYYY hh:mm:ss')
        appointments[item.appointment_id]=[item.patient_id,item.doctor_id,parseDateTime.unix()*1000];
    })
    //insert data
    try{
        await db.run(`INSERT INTO patients(name,age,gender,id) VALUES ${Object.keys(patients).map(el=>{patients[el].push(el);return`('${patients[el].join("','")}')`}).join(',')}`);
        await db.run(`INSERT INTO doctors(name,id) VALUES ${Object.keys(doctors).map(el=>{doctors[el].push(el);return`('${doctors[el].join("','")}')`}).join(',')}`);
        await db.run(`INSERT INTO appointments(patient_id,doctor_id,dateTime,id) VALUES ${Object.keys(appointments).map(el=>{appointments[el].push(el);return`('${appointments[el].join("','")}')`}).join(',')}`);
    }catch(er){
        console.error(er)
        return {success:false,msg:"Error in processig data"}
    }
    return {success:true}
}

const getAll = async ()=>{
    let patients = await db.all('Select * from patients');
    let doctors = await db.all('Select * from doctors');
    
    return {patients,doctors}
}

const getAppointments = async (doctorId, date)=>{
    let statement = `Select a.id as appid, d.name as name, a.dateTime
                    from doctors d, appointments a
                    where d.id=a.doctor_id `;
    let whereAddOn= [];
    if(doctorId ){
        whereAddOn.push(`d.id = "${doctorId}"`);
    }
    if(date){
        let startTime = moment(date).set("hour",0).set("minute",0).unix()*1000;
        let endTime = moment(date).set("hour",23).set("minute",59).unix()*1000;
        whereAddOn.push(`dateTime >= ${startTime} and dateTime <= ${endTime}`)
    }
    statement += whereAddOn.length > 0 ? 'and '+whereAddOn.join(' and ') : '';
    let res = await db.all(statement);
    res = res.map(el=>{
        el.dateTime = moment(el.dateTime).format("DDMMYYYY hh:mm");
        return Object.values(el);
    });
    return res;
}

const getAllAppointments = async ()=>{
    let statement = `Select a.id as appid, d.name as d_name, p.name as p_name,  a.dateTime
    from doctors d, patients p, appointments a
    where d.id=a.doctor_id and a.patient_id = p.id`;
    let res = await db.all(statement);
    res = res.map(el => {
        el.dateTime = moment(el.dateTime).format("DDMMYYYY hh:mm");
        return Object.values(el)
    });
    return res;
}

const createAppointment = async (patientId,doctorId,date)=>{
    //get latest appointment based on id
    let latestId = await db.get('select id from appointments order by id desc limit 1');
    //assume the id is hexadecimal which is not realistic but easier to add on
    let newId = (parseInt(latestId.id, 16) + 1).toString(16).toUpperCase();
    //add new 
    await db.run('insert into appointments(id,patient_id,doctor_id,dateTime) values (?,?,?,?)',newId,patientId,doctorId,date);
    return {status:'success'};
}

const deleteAppointment = async (appointmentId)=>{
    //delete appointment
    await db.run('delete from appointments where id = ?',appointmentId);
    return {status:'success'};
}

module.exports={
    initDBConnection,
    closeDBconnection,
    cleanTables,
    uploadAppointment,
    getAll,
    getAppointments,
    getAllAppointments,
    createAppointment,
    deleteAppointment
}