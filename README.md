# time-tracker-bot

This is still a work in progress and only includes basic functionality for the moment. New features will be added shortly.

time-tracker-bot is a Slack integration that allows you to easily track your work hours. Here's how it works:

1. Tell the bot when you start working: `/track start day`
2. Tell the bot when you go on a break: `/track start break`
3. Tell the bot when you come back from a break: `/track end break`
4. Repeat step 2 and 3 as many times as you would like
5. Tell the bot when you're done working, and you get the total of amount of time you worked: `/track end day`

PS: At any given time during the day, you can ask the bot to give you the total of amount of time worked so far: `/track current`

# Installation
_The application must run as `https`. I used [Let's Encrypt](https://letsencrypt.org/) to get a certificate._

1. Clone the repo
2. `cd` into the repo and run `npm install`
3. Rename / copy `config/index.sample.js` into `config/index.js`
4. Create a Slack integretion from Slack's developer site
5. Get a token for  your Slack integration and update `config/index.js` with the token
5. Point your Slack integration to your hosted time-tracker-bot

# Tests + CI
Coming soon :)

# License
time-tracker-bot is MIT licensed. Please refer to the LICENSE file in this repository for more details.

# Feedback
Any feedback is greatly appreciated. Don't hesitate to open issues or submit PRs.

Thanks!