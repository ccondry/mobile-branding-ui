import home from '../views/home'

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
  path: '*',
  redirect: path + '/'
}]
