import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import StuCourse from '@/components/course/StuCourse'
import TchCourse from '@/components/course/TchCourse'
import CourseDetails from '@/components/course/details/Course'
import CourseDetailsZuoye from '@/components/course/details/Zuoye'
import StuZuoye from '@/components/zuoye/stu/StuZuoye'
import TchCreateZY from '@/components/zuoye/tch/CreateZY'
import TchNewZY from '@/components/zuoye/tch/NewZY'

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
          path: '/coursedetails',
          name: 'CourseDetails',
          component: CourseDetails,
          children: [
            {
              path: '/coursedetails/zuoye',
              name: 'CourseDetailsZuoye',
              component: CourseDetailsZuoye
            },
          ]
        },
        {
          path: '/stucourse',
          name: 'StuCourse',
          component: StuCourse
        },
        {
          path: '/tchcourse',
          name: 'TchCourse',
          component: TchCourse
        },
        {
          path: '/stuzuoye',
          name: 'StuZuoye',
          component: StuZuoye
        },
        {
          path: '/tchcreatezy',
          name: 'TchCreateZY',
          component: TchCreateZY
        },
        {
          path: '/tchnewzy',
          name: 'TchNewZY',
          component: TchNewZY
        },
      ]
    }
  ]
})
