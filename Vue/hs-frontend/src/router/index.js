import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
const Home = () => import('../views/Home.vue')
import Result from '../views/Result.vue'

Vue.use(VueRouter)
Vue.use(Vuelidate)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/result',
    name: "Result",
    component: Result
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
