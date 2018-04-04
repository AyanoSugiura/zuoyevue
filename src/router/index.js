import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: '注册',
      component: Register
    },
    {
      path: '/Home',
      name: '主页',
      component: Home
    }
  ]
})
