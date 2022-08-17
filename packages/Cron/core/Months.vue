<template>
	<span>
		的
		<CustomSelect
			:options.sync="options"
			:disabled="disabled"
			:value.sync="currentValue"
			:width="100"
			:multiple="true"
			placeholder="每月"
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
			default: () => [
				{
					value: '1',
					label: '一月',
				},
				{
					value: '2',
					label: '二月',
				},
				{
					value: '3',
					label: '三月',
				},
				{
					value: '4',
					label: '四月',
				},
				{
					value: '5',
					label: '五月',
				},
				{
					value: '6',
					label: '六月',
				},
				{
					value: '7',
					label: '七月',
				},
				{
					value: '8',
					label: '八月',
				},
				{
					value: '9',
					label: '九月',
				},
				{
					value: '10',
					label: '十月',
				},
				{
					value: '11',
					label: '十一月',
				},
				{
					value: '12',
					label: '十二月',
				},
			],
		},
	},
	watch: {
		value(val) {
			this.currentValue = val
		},
	},
	data: () => ({
		currentValue: [],
	}),
	methods: {
		onChange(val) {
			this.currentValue = val
			this.$emit('change', this.currentValue)
		},
	},
}
</script>
