// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import { getRequest } from './utils/api'
import { postRequest } from './utils/api'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;


router.beforeEach((to, from, next) => {
  var user = localStorage.getItem('user');
  if (!user) {  /* 未登录 */
    if (to.name != 'Login' && to.name != 'Register') {
      !!user ? next() : next({path: '/login', query: {redirect: '/login'}});
    } else {
      next();
    }
  } else {
    if (to.name == 'Login' && to.name == 'Register') {
      next({path: '/', query: {redirect: '/'}});
    } else {
      next();
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
