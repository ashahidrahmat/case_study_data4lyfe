const e = require('express');

const 
    express = require('express'),
    next =  require('next'),
    bodyParser = require("body-parser"),
    upload = require("express-fileupload"),
    app = express(),
    db = require('./src/db_store');

const 
    PORT = 8080,
    ISDEV = false;

nextApp = next({dir: './', dev:ISDEV});

app.use(upload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/resetDB',async (req,res)=>{
    await db.cleanTables();
    res.json({status:"success"});
})

app.post('/api/upload',async (req,res)=>{
    if(!req.files){
        res.json({status:'failure'});
        return;
    }
    let result = await db.uploadAppointment(req.files.toParse);
    res.json({status:result.success ? "success" : "failure"})
});

app.post('/api/getAll',async (req,res)=>{
   let allData = await db.getAll();
    //res.json({status:result.success ? "success" : "failure"})
    res.json(allData)
});

app.post('/api/getDoctorPointment',async (req,res)=>{
    let doctorId = req.body.doctor, date = req.body.date;
    let pointmentData = await db.getAppointments(doctorId,date);
    res.json(pointmentData)
});

app.post('/api/createDeleteAppointment',async (req,res)=>{
    let type=req.body.type,resp = {};
    if(type=="create"){
        let pId = req.body.patient, dId = req.body.doctor, dateTime = req.body.dateTime;
        resp = await db.createAppointment(pId,dId,dateTime);
    }else{
        let appId = req.body.appointment;
        resp = await db.deleteAppointment(appId);
    }
    res.json(resp)
});

app.post('/api/getAllAppointments',async (req,res)=>{
    let allPointmentData = await db.getAllAppointments();
    res.json(allPointmentData)
})

app.get('*', async (req, res)=>{
    return nextApp.getRequestHandler()(req, res);
});

//Promise to init whatever that needs to be processed before server can start properly
var startUpPromises = [];

startUpPromises.push(nextApp.prepare());
startUpPromises.push(db.initDBConnection());

Promise.all(startUpPromises).then(()=>{
    app.listen(PORT, () => {
        console.log(`Server started and is listening at http://localhost:${PORT}`);
    })
})

//Cleanup, catch all possible escapes
const systemShutdowns = [
    `SIGINT`, 
    `SIGUSR1`, 
    `SIGUSR2`, 
    `SIGTERM`,
    `uncaughtException`
];
systemShutdowns.forEach((eventType) => {
    process.on(eventType, async ()=>{
        await db.cleanTables();
        await db.closeDBconnection();
        process.exit();
    });
})