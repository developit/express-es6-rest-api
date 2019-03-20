var mongoose = require('mongoose');

var TodosSchema = new mongoose.Schema({
    done: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ""
    },
    text: String,
    dateCreated: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
      }
});

module.exports = mongoose.model('Todos', TodosSchema);
