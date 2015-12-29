var mongoose = require('mongoose');  
var userSchema = new mongoose.Schema({  
  name: String,
  age: Number,
  dob: { type: Date, default: Date.now }
});
mongoose.model('User', userSchema);