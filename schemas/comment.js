const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    header: String,
    content: String,
    date: Date
})

module.exports = mongoose.model('comment', commentSchema)