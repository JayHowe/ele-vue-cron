<template>
	<span>
		的
		<CustomSelect
			:options.sync="hourOptions"
			:disabled="disabled"
			:value.sync="currentValue"
			:width="100"
			:multiple="true"
			placeholder="每小时"
			:clearable="true"
			:multipleLimit="multipleLimit"
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
		multipleLimit: {
			type: Number,
			default: 0,
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
		hourOptions: [],
	}),
	created() {
		this.initMonthDaysOption()
	},
	methods: {
		initMonthDaysOption() {
			const config = {
				type: 'hours',
				min: 0,
				max: 23,
				total: 24,
			}
			const options = [...Array(config.total)].map((_e, index) => {
				const number = config.min === 0 ? index : index + 1
				return {
					value: number.toString(),
					label: number.toString() + '点',
				}
			})
			this.hourOptions = options
		},
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
