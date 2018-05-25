import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Register from '@/components/Register'
import StuCourse from '@/components/course/StuCourse'
import TchCourse from '@/components/course/TchCourse'

import CourseDetails from '@/components/course/details/Course'
import CourseDetailsZuoye from '@/components/course/details/Zuoye'
import CourseDetailsMember from '@/components/course/details/Member'
import TchStatistic from '@/components/course/details/TchStatistic'
import CourseSetting from '@/components/course/details/Setting'

import TZyDetails from '@/components/zuoye/tch/TZyDetails'
import SZyDetails from '@/components/zuoye/stu/SZyDetails'

import StuZuoye from '@/components/zuoye/stu/StuZuoye'
import StuCj from '@/components/zuoye/stu/StuCj'

import SelfM from '@/components/SelfM'

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
            {
              path: '/coursedetails/member',
              name: 'CourseDetailsMember',
              component: CourseDetailsMember
            },
            {
              path: '/coursedetails/tchstatistic',
              name: 'TchStatistic',
              component: TchStatistic
            },
            {
              path: '/coursedetails/setting',
              name: 'CourseSetting',
              component: CourseSetting
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
          path: '/tzydetails',
          name: 'TZyDetails',
          component: TZyDetails
        },
        {
          path: '/szydetails',
          name: 'SZyDetails',
          component: SZyDetails
        },
        {
          path: '/stuzuoye',
          name: 'StuZuoye',
          component: StuZuoye
        },
        {
          path: '/stucj',
          name: 'StuCj',
          component: StuCj
        },

        {
          path: '/selfm',
          name: 'SelfM',
          component: SelfM
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
