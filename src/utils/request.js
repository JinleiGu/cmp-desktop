import axios from 'axios'
import { getToken } from '@/utils/auth'
import { MessageBox, Notification } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求完成回调
const finishCallback = function () {
  NProgress.done();
}

const service = axios.create({
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  baseURL: '/api',
  timeout: 5000,
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'indices' })
  }
})

service.interceptors.request.use(
  config => {
    NProgress.start()
    if (store.getters.token) {
      config.headers.token = getToken()
    }
    if (config.method && config.method.toLowerCase() === 'get') {
      config.url += '?t=' + new Date().getTime()
    } else {
      config.data = qs.stringify(config.data || {})
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    finishCallback()
    if (!response.data.success) {
      if (response.data.status === '401') {
        MessageBox.confirm('你的登录已经过期', {
          confirmButtonText: '重新登录',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (!response.config.ignoreError) {
        Notification.error({
          title: '',
          message: response.data.message
        })
      }
    }
    return response.data
  },
  error => {
    finishCallback()
    return Promise.reject(error)
  }
)

export default service
