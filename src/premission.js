import router from './router'
import { getToken } from '@/utils/auth'
import store from './store'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/retrieve']

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      return next()
    } else {
      await store.dispatch('user/getInfo')
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
