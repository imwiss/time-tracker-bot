var resources = {
    day_already_started: 'You already have a work day in progress. Please end your current day before starting a new one.',
    end_break_day_not_found: 'You\'re trying to end a break but have not started to work yet. Please start a new day if needed.',
    end_day_day_not_found: 'Are you trying to end your day before even starting to work? Please start a new day if needed.',
    end_break: 'Your break was %d minutes long, for a total of %d minutes of break so far today.',
    end_day: 'Great, you\'re done!',
    enjoy_break: 'Great. Enjoy your break!',
    error_occured: 'An error occured.',
    good_day: 'Alright! Have a good day at work today.',
    help: 'Use \'/track help\' to see the available commands.',
    help_commands: 'Use \'/track start day\' to start a new work day and begin tracking your time.\r\n' +
            'Use \'/track end day\' to end your current work day and get your total amount worked.\r\n' +
            'Use \'/track start break\' to start a break.\r\n' +
            'Use \'/track end break\' to end your current break and resume working.\r\n' +
            'Use \'/track current\' to get your total amount worked so far today.',
    on_break: 'You\'re currently on break. Please end your break first.',
    no_break: 'You are currently not on a break. Please start a new break if needed.',
    no_day: 'ou have not started to work yet. Please start a new day if needed.',
    start_break_day_not_found: 'Are you trying to take a break before even starting to work? Please start a new day if needed.',
    unsupported_command: 'Unsupported command.',
    work_info_in_minutes: 'You have worked a total of %d %s so far today.',
    work_info_in_hours: 'You have worked a total of %d %s and %d %s so far today.'
}

module.exports = resources;