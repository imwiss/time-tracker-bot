/* eslint new-cap: "off" */

var _ = require('lodash')
var moment = require('moment')
var mongoose = require('mongoose')
var ObjectId = mongoose.mongo.ObjectID
var Q = require('q')
var resources = require('../config/resources')
var util = require('util')
var winston = require('winston')

var logger = winston.loggers.get('mainLogger')

mongoose.Promise = Promise

var User = mongoose.model('User')
var WorkDay = mongoose.model('WorkDay')

function startDay (currentUser) {
  var deferred = Q.defer()

  var user = null
  findUserByUserId(currentUser.slack_user_id, currentUser.team_id)
    .then(function (retrievedUser) {
      if (!retrievedUser) {
        user = new User({
          slack_user_id: currentUser.slack_user_id,
          user_name: currentUser.user_name,
          team_id: currentUser.team_id,
          team_domain: currentUser.team_domain
        })
        return user.save().then(function (user) {
          return null
        })
      } else {
        user = retrievedUser
        return findOngoingWorkDayByUserId(user.id)
      }
    })
    .then(function (currentWorkDay) {
      if (!currentWorkDay) {
        var workDay = new WorkDay({
          start_time: new Date(),
          user: ObjectId(user.id)
        })
        return workDay.save()
      }

      throw resources.day_already_started
    })
    .then(function (message) {
      deferred.resolve(resources.good_day)
    })
    .catch(function (error) {
      logger.error(error)
      if (error instanceof Error) {
        deferred.reject(resources.error_occured)
      } else {
        deferred.reject(error)
      }
    })

  return deferred.promise
}

function endDay (currentUser) {
  var deferred = Q.defer()

  findUserByUserId(currentUser.slack_user_id, currentUser.team_id)
    .then(function (user) {
      if (user) {
        return findOngoingWorkDayByUserId(user.id)
      } else {
        throw resources.end_day_day_not_found
      }
    })
    .then(function (workDay) {
      if (!workDay) {
        throw resources.end_day_day_not_found
      }
      if (workDay.current_break_start_time) {
        throw resources.on_break
      }
      workDay.end_time = new Date()
      var diffBetweenStartAndEnd = moment(workDay.end_time).diff(moment(workDay.start_time), 'minutes')
      workDay.total = diffBetweenStartAndEnd - workDay.total_breaks_length
      return workDay.save()
    })
    .then(function (workDay) {
      var formattedWorkDayInformation = formatWorkDayInformation(workDay)
      deferred.resolve(resources.end_day + ' ' + formattedWorkDayInformation)
    })
    .catch(function (error) {
      logger.error(error)
      if (error instanceof Error) {
        deferred.reject(resources.error_occured)
      } else {
        deferred.reject(error)
      }
    })

  return deferred.promise
}

function startBreak (currentUser) {
  var deferred = Q.defer()

  findUserByUserId(currentUser.slack_user_id, currentUser.team_id)
    .then(function (user) {
      if (user) {
        return findOngoingWorkDayByUserId(user.id)
      } else {
        throw resources.start_break_day_not_found
      }
    })
    .then(function (workDay) {
      if (!workDay) {
        throw resources.start_break_day_not_found
      }
      if (workDay.current_break_start_time) {
        throw resources.on_break
      }
      workDay.current_break_start_time = new Date()
      return workDay.save()
    })
    .then(function (workDay) {
      deferred.resolve(resources.enjoy_break)
    })
    .catch(function (error) {
      logger.error(error)
      if (error instanceof Error) {
        deferred.reject(resources.error_occured)
      } else {
        deferred.reject(error)
      }
    })

  return deferred.promise
}

function endBreak (currentUser) {
  var deferred = Q.defer()

  var currentBreakLength = 0
  findUserByUserId(currentUser.slack_user_id, currentUser.team_id)
    .then(function (user) {
      if (user) {
        return findOngoingWorkDayByUserId(user.id)
      } else {
        throw resources.end_break_day_not_found
      }
    })
    .then(function (workDay) {
      if (!workDay) {
        throw resources.end_break_day_not_found
      }
      if (!workDay.current_break_start_time) {
        throw resources.no_break
      }
      var breakEnd = new moment()
      currentBreakLength = breakEnd.diff(moment(workDay.current_break_start_time), 'minutes')
      workDay.total_breaks_length += currentBreakLength
      workDay.current_break_start_time = null
      return workDay.save()
    })
    .then(function (workDay) {
      deferred.resolve(util.format(resources.end_break, currentBreakLength, workDay.total_breaks_length))
    })
    .catch(function (error) {
      logger.error(error)
      if (error instanceof Error) {
        deferred.reject(resources.error_occured)
      } else {
        deferred.reject(error)
      }
    })

  return deferred.promise
}

function getWorkDayInformation (currentUser) {
  var deferred = Q.defer()

  findUserByUserId(currentUser.slack_user_id, currentUser.team_id)
    .then(function (user) {
      if (user) {
        return findOngoingWorkDayByUserId(user.id)
      } else {
        throw resources.no_day
      }
    })
    .then(function (workDay) {
      if (!workDay) {
        throw resources.no_day
      }

      var formattedWorkDayInformation = formatWorkDayInformation(workDay)
      deferred.resolve(formattedWorkDayInformation)
    })
    .catch(function (error) {
      logger.error(error)
      if (error instanceof Error) {
        deferred.reject(resources.error_occured)
      } else {
        deferred.reject(error)
      }
    })

  return deferred.promise
}

function formatWorkDayInformation (workDay) {
  var currentBreakLength = 0
  if (workDay.current_break_start_time) {
    var breakEnd = new moment()
    currentBreakLength = breakEnd.diff(moment(workDay.current_break_start_time), 'minutes')
  }

  var currentTime = new moment()
  var currentWorkDayLength = currentTime.diff(moment(workDay.start_time), 'minutes')
  currentWorkDayLength = currentWorkDayLength - workDay.total_breaks_length - currentBreakLength
  var minutesString
  if (currentWorkDayLength < 60) {
    minutesString = currentWorkDayLength > 1 ? 'minutes' : 'minute'
    return util.format(resources.work_info_in_minutes, currentWorkDayLength, minutesString)
  } else {
    var currentWorkDayLengthInHours = _.floor(currentWorkDayLength / 60)
    var currentWorkDayLengthInMinutes = currentWorkDayLength % 60
    var hoursString = currentWorkDayLengthInHours > 1 ? 'hours' : 'hour'
    minutesString = currentWorkDayLengthInMinutes > 1 ? 'minutes' : 'minute'
    return util.format(resources.work_info_in_hours, currentWorkDayLengthInHours, hoursString, currentWorkDayLengthInMinutes, minutesString)
  }
}

function findOngoingWorkDayByUserId (userId) {
  return WorkDay.findOne({
    user: ObjectId(userId),
    end_time: { $exists: false }
  })
}

function findUserByUserId (userId, teamId) {
  return User.findOne({ slack_user_id: userId, team_id: teamId })
}

exports.endBreak = endBreak
exports.endDay = endDay
exports.getWorkDayInformation = getWorkDayInformation
exports.startBreak = startBreak
exports.startDay = startDay
