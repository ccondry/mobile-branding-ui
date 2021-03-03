import Vue from 'vue'
import app from './index.vue'
import store from './store'
// common panel component
import panel from './components/panel'
import copy from './components/copy'
import router from './router'
import './style.scss'

// Vue.router = router
// use 'buefy/src' when running from git,
import Buefy from 'buefy/src'
// or use 'buefy' when running from npm
// import Buefy from 'buefy'

// import specific buefy components used in this project
// import {
//   ConfigProgrammatic,
//   Table,
//   Input
// } from 'buefy'

// add Buefy to Vue
Vue.use(Buefy)

// add specific Buefy components to Vue
// Vue.use(Table)
// Vue.use(Input)
// ConfigProgrammatic.setOptions({
// defaultIconPack: 'fas',
// defaultContainerElement: '#content',
// })

// load panel component globally
Vue.component('Panel', panel)
// load clipboard copy button component globally
Vue.component('Copy', copy)

function hasQueryParams (route) {
  return !!Object.keys(route.query).length
}
// copy URL query parameters between routes
router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next(Object.assign({}, to, {query: from.query}))
  } else {
    next()
  }
})

new Vue({
  render: h => h(app),
  store,
  router
}).$mount('#app')
