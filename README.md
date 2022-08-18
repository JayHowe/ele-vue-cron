# ele-vue-cron
基于element-ui的定时任务管理库

## 依赖安装

```
npm i ele-vue-cron -S
```

### API 说明

| 参数名称         | 类型     | 说明                                                                                     |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| multipleLimit    | Number   | 配置月、周、天、时、分等选择的个数， 不传默认不限                                        |
| disabled         | Boolean  | 是否禁用，默认 false                                                                     |
| value            | String   | cron 表达式， 默认为 \* \* \* \* \*                                                      |
| onChange         | Function | 值改变时触发, 回调改变后的值                                                             |
| allowedPeriods   | Array    | 允许选择的时间周期，默认为['minute', 'hour', 'day', 'week', 'month', 'year']             |
| allowedDropdowns | Array    | 允许选择的时间粒度，默认为['period','months','month-days','week-days','hours','minutes'] |
| clearable        | Boolean  | 是否展示重置按钮，默认 false                                                             |
| clearableText    | String   | 重置按钮文案，默认 '重置'                                                                |

### 代码用例

```vue
<template>
	<div id="app">
		<div>
			<h3 class="title">一般用法:</h3>
			<EleVueCron :value.sync="cron" />
			<div class="title">cron表达式: {{ cron }}</div>
			<!-- 线 -->
			<div class="line"></div>
		</div>

		<div>
			<h3 class="title">高级用法:</h3>
			<EleVueCron
				:value.sync="cron2"
				:multipleLimit="1"
				:disabled="disabled"
				:allowedPeriods="allowedPeriods"
				defaultPeriod="month"
			/>
			<div class="title">cron表达式: {{ cron2 }}</div>
			<div class="line"></div>
		</div>
	</div>
</template>

<script>
import EleVueCron from 'ele-vue-cron'

export default {
	name: 'App',
	components: {
		EleVueCron,
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
```
