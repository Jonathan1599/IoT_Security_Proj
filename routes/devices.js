const express = require('express');
const router = express.Router();
//const socket = require('socket.io');
const User = require('../models/users');
const Device = require('../models/devices');
const { db } = require('../models/devices');

let vals = [1,2,3];


// router.get('/', function(req, res, next) {
//     setInterval(()=> {
//         values.push(values[values.length-1] + 11)
//     },3000);
//     let valLength  =values.length;
//     res.render('devices', { title: 'devices' });
//     io.sockets.on('connection' , (socket) => {
//         io.emit("firstdata", {dataval:values})
//         setInterval(() => {
//             if(values.length != valLength){
//                 io.emit("data", {dataval:values[valLength]}) 
//                 valLength = values.length;
//                 }
//         },100)
        
//     })
//   });
router.route('/register')
.get((req,res,next) => {
  if(req.isAuthenticated() == false)
  return res.redirect('/users/login');
  res.statusCode = 200;
  res.render('device_register',{user: req.user.firstname});
})
.post((req,res,next) => {
  if(req.isAuthenticated() == false)
  return res.redirect('/users/login')
  Device.create(req.body)
  .then( device => {
      if(device != null){
      User.updateOne({_id :req.user._id},{$push: { devices: device._id}})
      .then( user => {
        db.createCollection(device._id.toString())
        .then( () => {
          res.statusCode = 200;
          res.send(device);
        })
      })
      }
  },err => next(err))
  .catch(err => next(err));
});

const io = require('socket.io')(9000);

 router.get('/', async (req, res, next) => {
  if(req.isAuthenticated() == false)
  return res.redirect('/users/login')
  user = await User.findById(req.user._id)
  res.render('devices',{ids:user.devices});
 });

 router.get('/:deviceId', async (req, res, next) => {
  if(req.isAuthenticated() == false)
  return res.redirect('/users/login')
  //res.send(req.params.deviceId);

  device = await Device.findById(req.params.deviceId);
  if(device!=null)
  {

    db.collection(device._id.toString()).find({},{ time: 0 }).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      let data = [];
      result.forEach(result => {
        if(result.error == undefined)
        {
        data.push({temperature: result.temperature, time:result.time, power:result.power})
        //data = result;
        //console.log(result);
        }
      })
      res.render('devices_graph');
      io.on('connection' , (socket) => {
      console.log('A user connected');
      io.emit("firstdata", {dataval:data } )
      data= [];  // resset data on refresh
    });
    });
    let values = await collect.find({});
  
}
 });



    router.post('/delete/:idd',async (req,res,next) => {
      res.send(req.params.idd);
      if(req.isAuthenticated() == false)
    return res.redirect('/users/login')
    await Device.findByIdAndDelete(req.params.idd)
    await User.updateOne({_id :req.user._id},{$pull: { devices: req.params.idd}});
    res.send("Successful")
    });



  
  
  module.exports = router;