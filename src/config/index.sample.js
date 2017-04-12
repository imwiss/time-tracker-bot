const APP_NAME = 'TimeTracker'
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const PROTOCOL = process.env.PROTOCOL || 'http'

const ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development'
const DATABASE_URL = process.env.DATABASE_URL || `mongodb://localhost:27017/${APP_NAME.toLowerCase()}_${ENV}`
const URL = `${PROTOCOL}://${HOST}${PORT === 80 || PORT === 443 ? '' : `:${PORT}`}`
const SLACK_API_TOKEN = 'Insert Token Here'

var config = {
  showStack: false,
  mongodb: DATABASE_URL,
  appName: APP_NAME,
  protocol: PROTOCOL,
  port: parseInt(PORT, 10),
  host: HOST,
  env: ENV,
  url: URL,
  slackApiToken: SLACK_API_TOKEN
}

module.exports = config
