<template>
	<span>
		在
		<CustomSelect
			:options.sync="options"
			:disabled="disabled"
			:value.sync="currentValue"
			:width="130"
			:multiple="true"
			placeholder="一周里的每天"
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
	},
	watch: {
		value(val) {
			this.currentValue = val
		},
	},
	data: () => ({
		currentValue: [],
		options: [],
	}),
	created() {
		this.initMonthDaysOption()
	},
	methods: {
		initMonthDaysOption() {
			const config = {
				type: 'week-days',
				min: 0,
				max: 6,
				total: 7,
				alt: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			}
			const options = [...Array(config.total)].map((_e, index) => {
				const number = config.min === 0 ? index : index + 1
				return {
					value: number.toString(),
					label: config['alt'][index],
				}
			})
			this.options = options
			this.currentValue = this.value
		},
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
