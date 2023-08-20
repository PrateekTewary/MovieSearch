const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    userName:String,
    comment:String,
},{
    timestamps: true // This adds createdAt and updatedAt fields
    
});

module.exports = mongoose.model("Comment",CommentSchema);