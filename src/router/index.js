import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
import AddressForm from '@/components/AddressForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AddressForm',
      component: AddressForm
    }
  ]
})
