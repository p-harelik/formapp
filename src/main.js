import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import './filters/filters'
import money from 'v-money'

Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.use(money, {
  precision: 0,
  decimal: '.',
  thousands: ' ',
  prefix: '',
  suffix: ''
})

// window.BX24.init(() => {
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
// })
