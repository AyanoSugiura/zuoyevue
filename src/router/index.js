import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import StuCourse from '@/components/course/StuCourse'
import TchCourse from '@/components/course/TchCourse'
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
          path: '/tchcourse',
          name: 'TchCourse',
          component: TchCourse
        },
        {
          path: '/stucourse',
          name: 'StuCourse',
          component: StuCourse
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
