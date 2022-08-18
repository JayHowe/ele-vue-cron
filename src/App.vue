<template>
	<div id="app">
		<div>
			<h3 class="title">一般用法:</h3>
			<Cron :value.sync="cron" />
			<div class="title">cron表达式: {{ cron }}</div>
			<!-- 线 -->
			<div class="line"></div>
		</div>

		<div>
			<h3 class="title">高级用法:</h3>
			<Cron
				:value.sync="cron2"
				:multipleLimit="1"
				:disabled="disabled"
				:allowedPeriods="allowedPeriods"
				defaultPeriod="month"
			/>
			<div class="title">cron表达式: {{ cron2 }}</div>
			<!-- <div>
				<p>multipleLimit: </p>
			</div> -->
			<!-- 线 -->
			<div class="line"></div>
		</div>
	</div>
</template>

<script>
import Cron from '../packages/Cron'

export default {
	name: 'App',
	components: {
		Cron,
	},
	data() {
		return {
			disabled: false,
			cron: '* * * * *',
			cron2: '* * * * *',
			allowedPeriods: ['month', 'week', 'day'],
		}
	},
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	margin: 60px auto;
	width: 1000px;
}
.title {
	margin: 10px 0;
}

.line {
	width: 100%;
	height: 10px;
	border-bottom: dashed 1px #ddd;
}
</style>
