<template>
	<span>
		的
		<CustomSelect
			:options.sync="monthOptions"
			:disabled="disabled"
			:value.sync="currentValue"
			:multiple="true"
			placeholder="每天"
			:multipleLimit="multipleLimit"
			:clearable="true"
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
		multipleLimit: {
			type: Number,
			default: 0,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		value: {
			type: null,
			default: '',
		},
		options: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		value(val) {
			console.log('monthDays:', val)
			this.currentValue = val
		},
		options(vals) {
			this.months = vals
		},
	},
	data: () => ({
		currentValue: [],
		monthOptions: [],
	}),
	created() {
		this.initMonthDaysOption()
	},
	methods: {
		initMonthDaysOption() {
			const config = {
				type: 'month-days',
				total: 31,
				min: 1,
			}
			const options = [...Array(config.total)].map((_e, index) => {
				const number = config.min === 0 ? index : index + 1
				return {
					value: number.toString(),
					label: number.toString() + '号',
				}
			})
			this.monthOptions = options
			this.currentValue = this.value
		},
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
