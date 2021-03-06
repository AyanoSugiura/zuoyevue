import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: window.localStorage.getItem('user' || '[]') == null ? -1 : JSON.parse(window.localStorage.getItem('user' || '[]')).id,
      name: window.localStorage.getItem('user' || '[]') == null ? '未登录' : JSON.parse(window.localStorage.getItem('user' || '[]')).name,
      phone: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).phone,
      student_code: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).student_code,
      userlevel: window.localStorage.getItem('user' || '[]') == null ? -1 : JSON.parse(window.localStorage.getItem('user' || '[]')).userlevel,
      verify: window.localStorage.getItem('user' || '[]') == null ? -1 : JSON.parse(window.localStorage.getItem('user' || '[]')).verify,
      usable: window.localStorage.getItem('user' || '[]') == null ? -1 : JSON.parse(window.localStorage.getItem('user' || '[]')).usable

    },
    courseId: window.localStorage.getItem('courseId' || '[]'),
    routes: [],
    msgList: [],
    isDotMap: new Map(),
    currentFriend: {},
    nfDot: false
  },
  mutations: {
    login(state, user){
      state.user = user;
      window.localStorage.setItem('user', JSON.stringify(user));
    },
    alterMsg(state,data){
      state.user.name=data.name;
      state.user.phone=data.phone;
      console.log(data.phone);
      window.localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout(state){
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('courseId');
      state.routes = [];
    },
    setCourseId(state,courseId){
      state.courseId=courseId;
      window.localStorage.setItem('courseId', courseId);
    }
  
  },
  actions: {
    
  }
});
