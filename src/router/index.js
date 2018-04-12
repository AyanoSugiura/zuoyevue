import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Course from '@/components/course/Course'
import Zuoye from '@/components/zuoye/Zuoye'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/course',
          name: 'Course',
          component: Course
        },
        {
          path: '/zuoye',
          name: 'Zuoye',
          component: Zuoye
        }
      ]
    }
  ]
})
