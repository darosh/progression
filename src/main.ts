import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import vuetify from './plugins/vuetify'
// @ts-ignore
import VueHotkey from 'v-hotkey'

Vue.config.productionTip = false

Vue.use(VueHotkey)

new Vue({
  // router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
