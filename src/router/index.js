import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/desktop'
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('../views/login/login.vue')
    },
    {
      name: 'Retrieve',
      path: '/retrieve',
      component: () => import('../views/login/retrievePwd.vue')
    },
    {
      name: 'Desktop',
      path: '/desktop',
      component: () => import('../views/desktop/index.vue')
    },
    {
      name: 'Log',
      path: '/log',
      component: () => import('../views/log/list.vue')
    },
    {
      name: 'Useremanage',
      path: '/usermanage',
      component: () => import('../views/userManage/index.vue')
    },
    {
      name: 'Appmanage',
      path: '/appmanage',
      component: () => import('../views/appManage/index.vue')
    },
    {
      name: 'Organization',
      path: '/organization',
      component: () => import('../views/organization/index.vue')
    },
    {
      name: 'Resourcemanage',
      path: '/resourcemanage',
      component: () => import('../views/resourceManage/index.vue')
    },
    {
      name: '404',
      path: '/404',
      component: () => import('../views/errorPage/404.vue')
    },
    {
      name: 'test',
      path: '/test',
      component: () => import('../views/test/index.vue')
    }
  ]
})
