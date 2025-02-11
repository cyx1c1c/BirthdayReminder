import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import "intl";
import "intl/locale-data/jsonp/en.js"; // 载入默认语言（可根据需要更改）
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif