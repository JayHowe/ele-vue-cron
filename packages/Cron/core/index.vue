<template>
	<div class="cron-editor">
		<Period
			:value.sync="period"
			:allowedPeriods="allowedPeriods"
			:disabled="disabled"
			v-if="allowedDropdowns.includes('period')"
			@change="changePeriod"
		/>

		<Months
			:value.sync="months"
			:disabled="disabled"
			:multipleLimit="multipleLimit"
			v-if="allowedDropdowns.includes('months') && period === 'year'"
			@change="changeMonths"
		/>

		<MonthDays
			:value.sync="monthDays"
			:disabled="disabled"
			:multipleLimit="multipleLimit"
			v-if="
				(period === 'year' || period === 'month') &&
				allowedDropdowns.includes('month-days')
			"
			@change="changeMonthDays"
		/>

		<!-- period === 'year' || period === 'month' || 按年、按月 不展示周选择 -->
		<WeekDays
			:value.sync="weekDays"
			:disabled="disabled"
			:multipleLimit="multipleLimit"
			v-if="period === 'week' && allowedDropdowns.includes('week-days')"
			@change="changeWeekDays"
		/>
		<Hours
			:value.sync="hours"
			:disabled="disabled"
			:multipleLimit="multipleLimit"
			v-if="
				period !== 'minute' &&
				period !== 'hour' &&
				allowedDropdowns.includes('hours')
			"
			@change="changeHours"
		/>
		<Minutes
			:value.sync="minutes"
			:disabled="disabled"
			:multipleLimit="multipleLimit"
			v-if="period !== 'minute' && allowedDropdowns.includes('minutes')"
			@change="changeMinutes"
		/>
		<Button
			class="reset-btn"
			type="danger"
			:disabled="disabled"
			v-if="clearable"
			@click="reset"
		>
			{{ clearableText }}
		</Button>
	</div>
</template>

<script>
import Period from './Period'
import Months from './Months'
import MonthDays from './MonthDays'
import WeekDays from './WeekDays'
import Hours from './Hours'
import Minutes from './Minutes'
import {
	setValuesFromCronString,
	getCronStringFromValues,
} from './converter'
import { Button } from 'element-ui'


export default {
	components: {
		Period,
		Months,
		MonthDays,
		WeekDays,
		Hours,
		Minutes,
		Button,
	},
	props: {
		clearable: {
			type: Boolean,
			default: false,
		},
		clearableText: {
			type: String,
			default: '重置',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		humanizeValue: {
			type: Boolean,
			default: false,
		},
		multipleLimit: {
			type: Number,
			default: 0,
		},
		defaultPeriod: {
			type: String,
			default: '',
		},
		value: {
			type: null,
			default: '',
		},
		onError: {
			type: Function,
			default: () => undefined,
		},
		allowEmpty: {
			type: String,
			default: '',
		},
		locale: {
			type: Object,
			default: () => undefined,
		},
		shortcuts: {
			type: Array,
			default: () => [],
		},
		allowedDropdowns: {
			type: Array,
			default: () => [
				'period',
				'months',
				'month-days',
				'week-days',
				'hours',
				'minutes',
			],
		},
		allowedPeriods: {
			type: Array,
			default: () => [
				'year',
				'month',
				'week',
				'day',
				'hour',
				'minute',
				'reboot',
			],
		},
	},
	data: () => ({
		cronValue: '',
		period: '',
		months: undefined,
		monthDays: undefined,
		weekDays: undefined,
		hours: undefined,
		minutes: undefined,
		internalError: false,
		internalValueRef: '',
	}),
	mounted() {
		this.cronValue = this.value
		this.period = this.defaultPeriod
		this.initDataFromCronString()
	},
	watch: {
		value(val) {
			if (val !== this.cronValue) {
				this.cronValue = val
			}
		},
	},
	methods: {
		initDataFromCronString() {
			const { onError, allowEmpty, locale, shortcuts } = this
			const {
				period,
				months,
				monthDays,
				weekDays,
				hours,
				minutes,
				internalValueRef,
				internalError,
			} =
				setValuesFromCronString(
					this.cronValue,
					onError,
					allowEmpty,
					true,
					locale,
					shortcuts
				) || {}

			this.period = period || this.defaultPeriod || this.allowedPeriods[0]
			this.months = months
			this.monthDays = monthDays
			this.weekDays = weekDays
			this.hours = hours
			this.minutes = minutes
			this.internalError = internalError

			if (internalValueRef) {
				this.internalValueRef = internalValueRef
			}
		},
		changePeriod(val) {
			const {
				months,
				monthDays,
				weekDays,
				hours,
				minutes,
				humanizeValue,
			} = this
			const cron = getCronStringFromValues(
				val,
				months,
				monthDays,
				weekDays,
				hours,
				minutes,
				humanizeValue
			)
			console.log('val>', val)
			this.period = val
			this.callBack(cron)
		},
		changeMonths(val) {
			const {
				period,
				monthDays,
				weekDays,
				hours,
				minutes,
				humanizeValue,
			} = this
			const cron = getCronStringFromValues(
				period,
				val,
				monthDays,
				weekDays,
				hours,
				minutes,
				humanizeValue
			)
			this.months = val
			this.callBack(cron)
		},
		changeMonthDays(val) {
			const { period, months, weekDays, hours, minutes, humanizeValue } = this
			const cron = getCronStringFromValues(
				period,
				months,
				val,
				weekDays,
				hours,
				minutes,
				humanizeValue
			)
			this.monthDays = val
			this.callBack(cron)
		},
		changeWeekDays(val) {
			const { period, months, monthDays, hours, minutes, humanizeValue } = this
			const cron = getCronStringFromValues(
				period,
				months,
				monthDays,
				val,
				hours,
				minutes,
				humanizeValue
			)
			this.weekDays = val
			this.callBack(cron)
		},
		changeHours(val) {
			const {
				period,
				months,
				monthDays,
				weekDays,
				minutes,
				humanizeValue,
			} = this
			const cron = getCronStringFromValues(
				period,
				months,
				monthDays,
				weekDays,
				val,
				minutes,
				humanizeValue
			)
			this.hours = val
			this.callBack(cron)
		},
		changeMinutes(val) {
			const { period, months, monthDays, weekDays, hours, humanizeValue } = this
			const cron = getCronStringFromValues(
				period,
				months,
				monthDays,
				weekDays,
				hours,
				val,
				humanizeValue
			)
			this.minutes = val
			this.callBack(cron)
		},
		reset() {
			this.period = this.defaultPeriod || this.allowedPeriods[0] || 'day'
			this.cronValue = '* * * * *'
			this.initDataFromCronString()
			this.callBack(this.cronValue)
		},
		callBack(cron) {
			this.cronValue = cron
			this.$emit('update:value', this.cronValue)
			this.$emit('change', {
				cron: this.cronValue,
				period: this.period,
			})
		},
	},
}
</script>

<style>
.cron-editor {
	color: #5c5c5c;
	margin: 0;
}

.reset-btn {
	margin-left: 20px;
}
</style>
