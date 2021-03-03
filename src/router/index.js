import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
Vue.use(Router)

/** *
Items in the menu module will be added using generateRoutesFromMenu
Make sure you load all components here that are not listed in the menu module
***/
export default new Router({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes
})
