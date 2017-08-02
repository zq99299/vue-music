import 'babel-polyfill'  // es6 到 es5 的补丁转换
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import './common/stylus/index.styl'
import fastclick from 'fastclick'

fastclick.attach(document.body)  // 解决移动端点击延迟300毫秒

import vueLazyload from 'vue-lazyload'

Vue.use(vueLazyload, {
  // 加载中显示的图片
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
// 上面的 render: h => h(App) 中的h是createElement函数，是es6的简写语法
