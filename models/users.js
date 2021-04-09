var mongoose = require('mongoose')
var Schema = mongoose.Schema
const device = require('./devices');
var passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    firstname: {
        type: String,
        default: '',
        //required: true
    },
    lastname:{
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },

    devices:[{
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'Device'
    }]
  
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);