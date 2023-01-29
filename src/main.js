import Vue from 'vue'
import router from './router/index'
import store from './store'
import './premission'
import 'jquery'
import '../public/static/lib/jquery-ui.min.js'
import App from './App.vue'
import ElementUI, { Notification, MessageBox, Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import CmpBasic from 'cmp-basic'
import 'cmp-basic/dist/css/cmp-basic.css'
import rules from './validate/validate-rules'
import './icon/iconfont.css'
import './css/app.css'
import './css/css.css'

Vue.use(ElementUI, { size: 'small' })
Vue.use(CmpBasic, {
  rules: rules,
  request: {
    BASE_URL: process.env.VUE_APP_BASEURL,
    Notification,
    MessageBox,
    Loading
  }
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
