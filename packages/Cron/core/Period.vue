<template>
	<span>
		每
		<CustomSelect
			:options.sync="periodsOption"
			:disabled="disabled"
			:value.sync="currentValue"
			:width="80"
			@change="onChange"
		/>
	</span>
</template>

<script>
import CustomSelect from '../components/CustomSelect'
export default {
	components: {
		CustomSelect,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: 'year',
		},
		options: {
			type: Array,
			default: () => [],
		},
		allowedPeriods: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		periodsOption: [],
		currentValue: '',
	}),
	watch: {
		value(val) {
			// this.$emit('update:value', val)
			this.currentValue = val
		},
	},
	created() {
		this.initPeriodsOption()
	},
	methods: {
		initPeriodsOption() {
			const { allowedPeriods } = this
			const options = []
			if (allowedPeriods.includes('year')) {
				options.push({
					value: 'year',
					label: '年',
				})
			}

			if (allowedPeriods.includes('month')) {
				options.push({
					value: 'month',
					label: '月',
				})
			}

			if (allowedPeriods.includes('week')) {
				options.push({
					value: 'week',
					label: '周',
				})
			}

			if (allowedPeriods.includes('day')) {
				options.push({
					value: 'day',
					label: '日',
				})
			}

			if (allowedPeriods.includes('hour')) {
				options.push({
					value: 'hour',
					label: '小时',
				})
			}

			if (allowedPeriods.includes('minute')) {
				options.push({
					value: 'minute',
					label: '分钟',
				})
			}
			this.periodsOption = options
		},
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
