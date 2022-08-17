<template>
	<span>
		：<CustomSelect
			:options.sync="minutesOptions"
			:disabled="disabled"
			:value.sync="currentValue"
			:multiple="true"
			placeholder="每分钟"
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
			this.currentValue = val
		},
	},
	data: () => ({
		currentValue: [],
		minutesOptions: [],
	}),
	created() {
		this.initMonthDaysOption()
	},
	methods: {
		initMonthDaysOption() {
			const config = {
				type: 'minutes',
				min: 0,
				max: 59,
				total: 60,
			}
			const options = [...Array(config.total)].map((_e, index) => {
				const number = config.min === 0 ? index : index + 1
				return {
					value: number.toString(),
					label: number.toString() + '分',
				}
			})
			this.minutesOptions = options
		},
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
