// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vuex from 'vuex'
import router from './router'
Vue.config.productionTip = false
Vue.use(vuex)
const store= new vuex.Store({
  state:{
    count:0
  },
  mutations:{
    increment(state){
      state.count++
    },
    decrease (state){
      state.count--
    }
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: { App },
  template: '<App/>'
})
