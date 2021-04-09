var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Device = new Schema({
    name: {
        type: String,
        default: '' ,
        required : true
    },

    connectedDevice : {
        type: String,
        default: '',
        required: true
    }
  
})


module.exports = mongoose.model('Device', Device);