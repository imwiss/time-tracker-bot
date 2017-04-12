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

function handleAction(req, res, next) {
  logger.info(JSON.stringify(req.body))
  var currentUser = {
    slack_user_id: req.body.user_id,
    user_name: req.body.user_name,
    action: req.body.text,
    team_id: req.body.team_id,
    team_domain: req.body.team_domain
  }
  Q.when(executeCorrespondingAction (currentUser), function (message) {
    res.send(message)
  }).catch(function (error) {
    logger.error(error)
    res.send('Oups! An error just occured.\r\n' + resources.help)
  })
}

function executeCorrespondingAction(currentUser) {
  switch (currentUser.action.toLowerCase()) {
    case START_DAY_ACTION:
      return tracker.startDay(currentUser)
    case END_DAY_ACTION:
      return tracker.endDay(currentUser)
    case START_BREAK_ACTION:
      return tracker.startBreak(currentUser)
    case END_BREAK_ACTION:
      return tracker.endBreak(currentUser)
    case CURRENT:
      return tracker.getWorkDayInformation(currentUser)
    default:
      return Q(resources.help_commands)
  }
}

exports.handleAction = handleAction
