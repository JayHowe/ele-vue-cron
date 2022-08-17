import Cron from './core/index'

Cron.install = function (Vue) {
	Vue.component(Cron.name, Cron)
}

export default Cron
