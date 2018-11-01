import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/Home'
import User from '@/views/User'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/users',
          component: User
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
})
