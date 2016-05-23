var jsonSelect = require('mongoose-json-select');
var mongoose = require('mongoose');

var CommonPlugin = require('./plugins/common');

const WorkDays = new mongoose.Schema({
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date
  },
  total: {
    type: Number,
    default: 0
  },
  current_break_start_time: {
    type: Date
  },
  total_breaks_length: {
    type: Number,
    default: 0,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  }
});

WorkDays.plugin(CommonPlugin('workDay'));

module.exports = mongoose.model('WorkDay', WorkDays);