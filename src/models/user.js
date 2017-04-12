var mongoose = require('mongoose')

var CommonPlugin = require('./plugins/common')

const Users = new mongoose.Schema({
  team_id: {
    type: String,
    required: true,
    trim: true
  },
  team_domain: {
    type: String,
    required: true,
    trim: true
  },
  slack_user_id: {
    type: String,
    required: true,
    index: true,
    trim: true,
    unique: true
  },
  user_name: {
    type: String,
    required: true,
    trim: true
  }
})

Users.plugin(CommonPlugin('user'))

module.exports = mongoose.model('User', Users)
