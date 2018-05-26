// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import stum from '@/components/menu/stum'
import tchm from '@/components/menu/tchm'
import admin from '@/components/Admin'
import router from './router'
import ElementUI from 'element-ui'
import Mdui from 'mdui'
import 'element-ui/lib/theme-chalk/index.css'
import './mdui/css/mdui.css'
import store from './store'
import { getRequest } from './utils/api'
import { postRequest } from './utils/api'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.component("stum", stum)
Vue.component("tchm", tchm)
Vue.component("admin", admin)

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;


router.beforeEach((to, from, next) => {
  var user = localStorage.getItem('user');

  if (user == null) {  /* 未登录 */
    if (to.name != 'Login' && to.name != 'Register') {
      !!user ? next() : next({ path: '/Login' });
    } else {
      next();
    }
  } else {

    if (to.name == 'Login' || to.name == 'Register') {
      if (user.userlevel == 0 || user.userlevel == 1) {
        next({ path: '/' }); //, query: { redirect: '/' } 
      }
      else if (user.userlevel == 2) {
        console.log(to.name);
        next({ path: '/' });
      }
    } else {
      // if (to.name == 'Home' && (user.userlevel == 0 || user.userlevel == 1)) {
      //   console.log(to.name);
      // }
      next();
      // } else if (user.userlevel == 0 || user.userlevel == 1) {

      // }

    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
