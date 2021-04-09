const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const Devices = require('../models/devices');
const { db } = require('../models/devices');
const io = require('socket.io')(8000);

router.use(bodyParser.json());
router.post('/:deviceId',async (req,res,next) => {
   // res.json(req.body.temperature)
    device = await Devices.findById(req.params.deviceId);
    if(device!=null)
    {   
        if (req.body.error)
        obj = {error:req.body.error, time: req.body.time};
        else
        obj = {temperature: req.body.temperature, time: req.body.time, power: req.body.power};
        let collect = db.collection(device._id.toString());
        collect.insertOne(req.body);
        res.statusCode = 200;
        res.setHeader('Content-Type','text/html');
        res.send("Successful")
         io.on('connection', (socket) => {
            io.emit("new", obj );
       });
       //if(io.connected)
       io.emit("new", obj);
        
    }
})
router.get('/',(req,res,next) =>{
    res.send("hey");
})

module.exports = router;