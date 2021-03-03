import home from '../views/home'
import option from '../views/option'

const path = ''

export default [{
  name: 'Home',
  path: path + '/',
  meta: {
    icon: 'home',
    description: 'Home'
  },
  component: home
}, {
  name: 'Option',
  path: path + '/option/:index',
  component: option
}, {
  path: '*',
  redirect: path + '/'
}]
