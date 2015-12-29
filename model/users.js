var mongoose = require('mongoose');  
var userSchema = new mongoose.Schema({  
  name: String,
  position: String
});
mongoose.model('User', userSchema);