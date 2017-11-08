const mongoose = require('mongoose');

module.exports.ToDo = mongoose.model('ToDo', {
  text: {
    type: String,
    required: true,
    minilength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});
