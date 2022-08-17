/**
 * Creates an array of integers from start to end, inclusive
 */
 export function range(start, end) {
	const array = []

	for (let i = start; i <= end; i++) {
		array.push(i)
	}

	return array
}

/**
 * Sorts an array of numbers
 */
export function sort(array) {
	array.sort(function (a, b) {
		return a - b
	})

	return array
}

/**
 * Removes duplicate entries from an array
 */
export function dedup(array) {
	const result = []

	array.forEach(function (i) {
		if (result.indexOf(i) < 0) {
			result.push(i)
		}
	})

	return result
}

/**
 * Simple classNames util function to prevent adding external library 'classnames'
 */
export function classNames(classes) {
	return Object.entries(classes)
		.filter(([key, value]) => key && value)
		.map(([key]) => key)
		.join(' ')
}

/**
 * Handle onError prop to set the error
 */
export function setError(onError, locale) {
	onError &&
		onError({
			type: 'invalid_cron',
			description:
				(locale && locale.errorInvalidCron) || 'Invalid cron expression',
		})
}
