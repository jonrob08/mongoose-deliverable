const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    // embedded
    // comments: [commentSchema],
    // reference
    comments: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'comment'
    }]
})

module.exports = mongoose.model('Post', postSchema)