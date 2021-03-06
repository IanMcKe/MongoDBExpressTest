var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  username: String,
  password: String, //hash created from password
  created_at: {type: Date, default: Date.now}
});

var postSchema = new mongoose.Schema({
  text: String,
  created_by: { type: Schema.ObjectId, ref: 'User' },
  created_at: {type: Date, default: Date.now}
});

//declare a model called User which has the schema userSchema
mongoose.model('User', userSchema);
//declare a model called Post which has the schema postSchema
mongoose.model('Post', postSchema);
