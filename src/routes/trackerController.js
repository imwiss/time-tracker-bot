var Q = require('q')
var resources = require('../config/resources')
var tracker = require('../core/tracker')
var winston = require('winston')

var logger = winston.loggers.get('mainLogger')

const START_DAY_ACTION = 'start day'
const END_DAY_ACTION = 'end day'

const START_BREAK_ACTION = 'start break'
const END_BREAK_ACTION = 'end break'

const CURRENT = 'current'
const HELP = 'help'

function handleAction (req, res, next) {
  logger.info(JSON.stringify(req.body))
  executeCorrespondingAction(req)
    .then(function (message) {
      res.send(message)
    })
    .catch(function (error) {
      res.send(error + ' ' + resources.help)
    })
}

function executeCorrespondingAction (req) {
  var currentUser = {
    slack_user_id: req.body.user_id,
    user_name: req.body.user_name,
    action: req.body.text,
    team_id: req.body.team_id,
    team_domain: req.body.team_domain
  }

  if (currentUser.action.toLowerCase() === START_DAY_ACTION) {
    return tracker.startDay(currentUser)
  }
  if (currentUser.action.toLowerCase() === END_DAY_ACTION) {
    return tracker.endDay(currentUser)
  }
  if (currentUser.action.toLowerCase() === START_BREAK_ACTION) {
    return tracker.startBreak(currentUser)
  }
  if (currentUser.action.toLowerCase() === END_BREAK_ACTION) {
    return tracker.endBreak(currentUser)
  }
  if (currentUser.action.toLowerCase() === HELP) {
    return Q(resources.help_commands)
  }
  if (currentUser.action.toLowerCase() === CURRENT) {
    return tracker.getWorkDayInformation(currentUser)
  }

  throw resources.unsupported_command
}

exports.handleAction = handleAction
