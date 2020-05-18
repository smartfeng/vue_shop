import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入NProgress包对应的js 和 css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 设置公共请求地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 在request拦截器中显示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  // 请求时显示进度条
  Nprogress.start()
  // 为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  // 响应回来隐藏进度条
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 表格树
Vue.component('tree-table', TreeTable)
// 富文本编辑插件
Vue.use(VueQuillEditor)
// 日期的处理
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
