import { UNITS, SUPPORTED_SHORTCUTS } from './constants'
import { range, sort, dedup, setError } from './utils'

/**
 * Set values from cron string
 */
export function setValuesFromCronString(
	cronString,
	onError,
	allowEmpty,
	firstRender,
	locale,
	shortcuts
) {
	onError && onError(undefined)
	let internalError = false

	let error = false

	// Handle empty cron string
	if (!cronString) {
		if (
			allowEmpty === 'always' ||
			(firstRender && allowEmpty === 'for-default-value')
		) {
			return
		}

		error = true
	}

	if (!error) {
		// Shortcuts management
		if (shortcuts && (shortcuts === true || shortcuts.includes(cronString))) {
			if (cronString === '@reboot') {
				return {
					period: 'reboot',
					internalError,
				}
			}

			// Convert a shortcut to a valid cron string
			const shortcutObject = SUPPORTED_SHORTCUTS.find(
				(supportedShortcut) => supportedShortcut.name === cronString
			)

			if (shortcutObject) {
				cronString = shortcutObject.value
			}
		}

		try {
			const cronParts = parseCronString(cronString)
			const period = getPeriodFromCronParts(cronParts)

			return {
				period,
				months: cronParts[3],
				monthDays: cronParts[2],
				weekDays: cronParts[4],
				hours: cronParts[1],
				minutes: cronParts[0],
				internalError,
			}
		} catch (err) {
			// Specific errors are not handle (yet)
			error = true
		}
	}
	if (error) {
		setError(onError, locale)
		return {
			internalValueRef: cronString,
			internalError: true,
		}
	}
}

/**
 * Get cron string from values
 */
export function getCronStringFromValues(
	period,
	months,
	monthDays,
	weekDays,
	hours,
	minutes,
	humanizeValue
) {
	if (period === 'reboot') {
		return '@reboot'
	}

	const newMonths = period === 'year' && months ? months : []
	const newMonthDays =
		(period === 'year' || period === 'month') && monthDays ? monthDays : []
	const newWeekDays =
		(period === 'year' || period === 'month' || period === 'week') && weekDays
			? weekDays
			: []
	const newHours =
		period !== 'minute' && period !== 'hour' && hours ? hours : []
	const newMinutes = period !== 'minute' && minutes ? minutes : []

	const parsedArray = parseCronArray(
		[newMinutes, newHours, newMonthDays, newMonths, newWeekDays],
		humanizeValue
	)

	return cronToString(parsedArray)
}

/**
 * Returns the cron part array as a string.
 */
export function partToString(
	cronPart,
	unit,
	humanize,
	leadingZero,
	clockFormat
) {
	let retval = ''

	if (isFull(cronPart, unit) || cronPart.length === 0) {
		retval = '*'
	} else {
		const step = getStep(cronPart)

		if (step && isInterval(cronPart, step)) {
			if (isFullInterval(cronPart, unit, step)) {
				retval = `*/${step}`
			} else {
				retval = `${formatValue(
					getMin(cronPart),
					unit,
					humanize,
					leadingZero,
					clockFormat
				)}-${formatValue(
					getMax(cronPart),
					unit,
					humanize,
					leadingZero,
					clockFormat
				)}/${step}`
			}
		} else {
			retval = toRanges(cronPart)
				.map((r) => {
					if (Array.isArray(r)) {
						return `${formatValue(
							r[0],
							unit,
							humanize,
							leadingZero,
							clockFormat
						)}-${formatValue(r[1], unit, humanize, leadingZero, clockFormat)}`
					}

					return formatValue(r, unit, humanize, leadingZero, clockFormat)
				})
				.join(',')
		}
	}
	return retval
}

/**
 * Format the value
 */
export function formatValue(value, unit, humanize, leadingZero, clockFormat) {
	let cronPartString = value.toString()
	const { type, alt, min } = unit
	const needLeadingZero =
		leadingZero && (leadingZero === true || leadingZero.includes(type))
	const need24HourClock =
		clockFormat === '24-hour-clock' && (type === 'hours' || type === 'minutes')

	if ((humanize && type === 'week-days') || (humanize && type === 'months')) {
		cronPartString = alt && alt[value - min]
	} else if (value < 10 && (needLeadingZero || need24HourClock)) {
		cronPartString = cronPartString.padStart(2, '0')
	}

	if (type === 'hours' && clockFormat === '12-hour-clock') {
		const suffix = value >= 12 ? 'PM' : 'AM'
		let hour = value % 12 || 12

		if (hour < 10 && needLeadingZero) {
			hour = hour.toString().padStart(2, '0')
		}

		cronPartString = `${hour}${suffix}`
	}

	return cronPartString
}

/**
 * Validates a range of positive integers
 */
export function parsePartArray(arr, unit) {
	const values = sort(dedup(fixSunday(arr, unit)))

	if (values.length === 0) {
		return values
	}

	const value = outOfRange(values, unit)

	if (typeof value !== 'undefined') {
		throw new Error(`Value "${value}" out of range for ${unit.type}`)
	}

	return values
}

/**
 * Parses a 2-dimensional array of integers as a cron schedule
 */
function parseCronArray(cronArr, humanizeValue) {
	return cronArr.map((partArr, idx) => {
		const unit = UNITS[idx]
		const parsedArray = parsePartArray(partArr, unit)

		return partToString(parsedArray, unit, humanizeValue)
	})
}

/**
 * Returns the cron array as a string
 */
function cronToString(parts) {
	return parts.join(' ')
}

/**
 * Find the period from cron parts
 */
function getPeriodFromCronParts(cronParts) {
	if (cronParts[3].length > 0) {
		return 'year'
	} else if (cronParts[2].length > 0) {
		return 'month'
	} else if (cronParts[4].length > 0) {
		return 'week'
	} else if (cronParts[1].length > 0) {
		return 'day'
	} else if (cronParts[0].length > 0) {
		return 'hour'
	}
	return ''
}

/**
 * Parses a cron string to an array of parts
 */
function parseCronString(str) {
	if (typeof str !== 'string') {
		throw new Error('Invalid cron string')
	}

	const parts = str.replace(/\s+/g, ' ').trim().split(' ')

	if (parts.length === 5) {
		return parts.map((partStr, idx) => {
			return parsePartString(partStr, UNITS[idx])
		})
	}

	throw new Error('Invalid cron string format')
}

/**
 * Parses a string as a range of positive integers
 */
function parsePartString(str, unit) {
	if (str === '*' || str === '*/1') {
		return []
	}

	const stringParts = str.split('/')

	if (stringParts.length > 2) {
		throw new Error(`Invalid value "${unit.type}"`)
	}

	const rangeString = replaceAlternatives(stringParts[0], unit.min, unit.alt)
	let parsedValues

	if (rangeString === '*') {
		parsedValues = range(unit.min, unit.max)
	} else {
		parsedValues = sort(
			dedup(
				fixSunday(
					rangeString
						.split(',')
						.map((r) => {
							return parseRange(r, str, unit)
						})
						.flat(),
					unit
				)
			)
		)

		const value = outOfRange(parsedValues, unit)

		if (typeof value !== 'undefined') {
			throw new Error(`Value "${value}" out of range for ${unit.type}`)
		}
	}

	const step = parseStep(stringParts[1], unit)
	const intervalValues = applyInterval(parsedValues, step)

	if (intervalValues.length === unit.total) {
		return []
	} else if (intervalValues.length === 0) {
		throw new Error(`Empty interval value "${str}" for ${unit.type}`)
	}

	return intervalValues
}

/**
 * Replaces the alternative representations of numbers in a string
 */
function replaceAlternatives(str, min, alt) {
	if (alt) {
		str = str.toUpperCase()

		for (let i = 0; i < alt.length; i++) {
			str = str.replace(alt[i], `${i + min}`)
		}
	}
	return str
}

/**
 * Replace all 7 with 0 as Sunday can be represented by both
 */
function fixSunday(values, unit) {
	if (unit.type === 'week-days') {
		values = values.map(function (value) {
			if (value === 7) {
				return 0
			}

			return value
		})
	}

	return values
}

/**
 * Parses a range string
 */
function parseRange(rangeStr, context, unit) {
	const subparts = rangeStr.split('-')

	if (subparts.length === 1) {
		const value = parseInt(subparts[0], 10)

		if (isNaN(value)) {
			throw new Error(`Invalid value "${context}" for ${unit.type}`)
		}

		return [value]
	} else if (subparts.length === 2) {
		const minValue = parseInt(subparts[0], 10)
		const maxValue = parseInt(subparts[1], 10)

		// Fix to allow equal min and max range values
		// cf: https://github.com/roccivic/cron-converter/pull/15
		if (maxValue < minValue) {
			throw new Error(
				`Max range is less than min range in "${rangeStr}" for ${unit.type}`
			)
		}

		return range(minValue, maxValue)
	} else {
		throw new Error(`Invalid value "${rangeStr}" for ${unit.type}`)
	}
}

/**
 * Finds an element from values that is outside of the range of unit
 */
function outOfRange(values, unit) {
	const first = values[0]
	const last = values[values.length - 1]

	if (first < unit.min) {
		return first
	} else if (last > unit.max) {
		return last
	}

	return
}

/**
 * Parses the step from a part string
 */
function parseStep(step, unit) {
	if (typeof step !== 'undefined') {
		const parsedStep = parseInt(step, 10)

		if (isNaN(parsedStep) || parsedStep < 1) {
			throw new Error(`Invalid interval step value "${step}" for ${unit.type}`)
		}

		return parsedStep
	}
}

/**
 * Applies an interval step to a collection of values
 */
function applyInterval(values, step) {
	if (step) {
		const minVal = values[0]

		values = values.filter((value) => {
			return value % step === minVal % step || value === minVal
		})
	}

	return values
}

/**
 * Returns true if range has all the values of the unit
 */
function isFull(values, unit) {
	return values.length === unit.max - unit.min + 1
}

/**
 * Returns the difference between first and second elements in the range
 */
function getStep(values) {
	if (values.length > 2) {
		const step = values[1] - values[0]

		if (step > 1) {
			return step
		}
	}
}

/**
 * Returns true if the range can be represented as an interval
 */
function isInterval(values, step) {
	for (let i = 1; i < values.length; i++) {
		const prev = values[i - 1]
		const value = values[i]

		if (value - prev !== step) {
			return false
		}
	}

	return true
}

/**
 * Returns true if the range contains all the interval values
 */
function isFullInterval(values, unit, step) {
	const min = getMin(values)
	const max = getMax(values)
	const haveAllValues = values.length === (max - min) / step + 1

	if (min === unit.min && max + step > unit.max && haveAllValues) {
		return true
	}

	return false
}

/**
 * Returns the smallest value in the range
 */
function getMin(values) {
	return values[0]
}

/**
 * Returns the largest value in the range
 */
function getMax(values) {
	return values[values.length - 1]
}

/**
 * Returns the range as an array of ranges
 * defined as arrays of positive integers
 */
function toRanges(values) {
	const retval = []
	let startPart = null

	values.forEach((value, index, self) => {
		if (value !== self[index + 1] - 1) {
			if (startPart !== null) {
				retval.push([startPart, value])
				startPart = null
			} else {
				retval.push(value)
			}
		} else if (startPart === null) {
			startPart = value
		}
	})

	return retval
}
