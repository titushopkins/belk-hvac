import { syncReviews } from './syncReviews.js'

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

Date.prototype.monthDays = function () {
	var d = new Date(this.getFullYear(), this.getMonth() + 1, 0)
	return d.getDate()
}

let startAutomations = function () {
	// let now = new Date()

	// console.log('starting!')

	setInterval(() => {
		// Optional timezone offset for server
		let now = new Date(Date.now() - 1000 * 60 * 60 * 6)

		let day = now.getDay()
		let weekday = days[day]
		let date = now.getDate()
		let month = now.getMonth()

		let hour = now.getHours()
		let minute = now.getMinutes()

		let monthDays = now.monthDays()
		let nthWeekdayOfMonth = Math.ceil(day / 7)
		let daysRemainingInMonth = monthDays - date
		let lastWeekdayOfMonth = daysRemainingInMonth < 7

		// Automations to run (cron)
		// if ((weekday == 'Thursday' || weekday == 'Friday') && hour == 8 && minute == 1) doSomethingCool()

		// Sync Google reviews twice daily at 8am and 8pm
		if ((hour == 8 || hour == 20) && minute == 0) syncReviews()
	}, 1000 * 60)
}

export default startAutomations
